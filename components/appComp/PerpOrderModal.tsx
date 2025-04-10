import { useState } from "react";
import { Modal, Button, LineTabs } from "@/components/UI";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import {
  MainnetPerpMarkets,
  MarketType,
  OrderParams,
  OrderTriggerCondition,
  OrderType,
  PositionDirection,
  PostOnlyParams,
} from "@drift-labs/sdk";
import useWalletConnect from "@/hooks/useWalletConnect";

interface PerpOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IOrderDetails {
  marketIndex: number;
  marketSymbol: string;
  size: string;
  price: string;
  orderType: OrderType;
  direction: PositionDirection;
  auctionStartPrice?: string;
  auctionEndPrice?: string;
  auctionDuration?: number;
}

const orders = [
  {
    label: "Market",
    slug: "market",
  },
  {
    label: "Limit",
    slug: "limit",
  },
];

export const PerpOrderModal = ({ isOpen, onClose }: PerpOrderModalProps) => {
  const [orderDetails, setOrderDetails] = useState<IOrderDetails>({
    marketIndex: 0,
    marketSymbol: "",
    size: "",
    price: "",
    orderType: OrderType.MARKET,
    direction: PositionDirection.LONG,
    auctionStartPrice: "",
    auctionEndPrice: "",
    auctionDuration: 60,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("market");
  const { subAccounts, driftClient, getUserSubAccounts, userAssets } =
    useAppStore();
  const [selectedSubaccount, setSelectedSubaccount] = useState(
    subAccounts[0]?.subAccountId || 0
  );
  const { address } = useWalletConnect();

  // Get SOL price from userAssets
  const solAsset = userAssets.find((asset) => asset.symbol === "SOL");
  const solPrice = solAsset?.price || 0;

  // Calculate auction prices based on direction and current price
  const calculateAuctionPrices = (
    direction: PositionDirection,
    currentPrice: number
  ) => {
    if (direction === PositionDirection.LONG) {
      // For LONG: Start slightly above market, end higher
      return {
        startPrice: (currentPrice * 1.001).toFixed(2), // 0.1% above market
        endPrice: (currentPrice * 1.005).toFixed(2), // 0.5% above market
      };
    } else {
      // For SHORT: Start slightly below market, end lower
      return {
        startPrice: (currentPrice * 0.999).toFixed(2), // 0.1% below market
        endPrice: (currentPrice * 0.995).toFixed(2), // 0.5% below market
      };
    }
  };

  // Update auction prices when direction changes
  const handleDirectionChange = (newDirection: PositionDirection) => {
    const { startPrice, endPrice } = calculateAuctionPrices(
      newDirection,
      solPrice
    );
    setOrderDetails({
      ...orderDetails,
      direction: newDirection,
      auctionStartPrice: startPrice,
      auctionEndPrice: endPrice,
    });
  };

  // Calculate SOL amount from USDC size
  const solAmount = solPrice > 0 ? Number(orderDetails.size) / solPrice : 0;

  const handlePlaceOrder = async () => {
    try {
      if (!driftClient) {
        toast.error("Drift client not initialized");
        return;
      }
      setIsLoading(true);

      const { marketIndex, direction } = orderDetails;
      await driftClient.subscribe();

      if (activeTab === "market") {
        const now = Date.now();
        const { startPrice, endPrice } = calculateAuctionPrices(
          direction,
          solPrice
        );
        const orderParams = {
          orderType: OrderType.MARKET,
          marketIndex,
          direction,
          baseAssetAmount: driftClient.convertToPerpPrecision(solAmount),
          auctionStartPrice: driftClient.convertToPricePrecision(
            Number(startPrice)
          ),
          auctionEndPrice: driftClient.convertToPricePrecision(
            Number(endPrice)
          ),
          price: driftClient.convertToPricePrecision(Number(endPrice) + 0.05),
          auctionDuration: 60,
          maxTs: now + 100,
        };
        console.log("orderParams", orderParams);
        await driftClient.placePerpOrder(orderParams);
      } else {
        // Limit order
        const orderParams = {
          orderType: OrderType.LIMIT,
          marketIndex,
          direction,
          baseAssetAmount: driftClient.convertToPerpPrecision(
            Number(orderDetails.size)
          ),
          price: driftClient.convertToPricePrecision(
            Number(orderDetails.price)
          ),
        };
        await driftClient.placePerpOrder(orderParams);
      }

      await getUserSubAccounts(address!);
      toast.success("Order placed successfully");
      onClose();
    } catch (error) {
      console.error("Order placement failed:", error);
      toast.error("Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      close={onClose}
      title="Place SOL-PERP Order"
      showCloseButton
    >
      <div className="space-y-6 mt-4">
        {/* Subaccount Selection */}
        <div>
          <label className="block text-sm font-medium text-primary/60 mb-2">
            Select Subaccount
          </label>
          <select
            value={selectedSubaccount}
            onChange={(e) => setSelectedSubaccount(Number(e.target.value))}
            className="w-full px-2 py-2 bg-primary/5 border border-primary/10 rounded-lg focus:outline-none focus:border-primary/20"
          >
            {subAccounts.map((account) => (
              <option key={account.subAccountId} value={account.subAccountId}>
                {account.name.length > 0
                  ? String.fromCharCode(...account.name).trim()
                  : `Subaccount ${account.subAccountId}`}
              </option>
            ))}
          </select>
        </div>

        {/* Market Selection */}
        <div>
          <label className="block text-sm font-medium text-primary/60 mb-2">
            Select Market
          </label>
          <select
            value={orderDetails.marketIndex}
            onChange={(e) => {
              const market = MainnetPerpMarkets[Number(e.target.value)];
              setOrderDetails({
                ...orderDetails,
                marketIndex: Number(e.target.value),
                marketSymbol: market.symbol,
              });
            }}
            className="w-full px-2 py-2 bg-primary/5 border border-primary/10 rounded-lg focus:outline-none focus:border-primary/20"
          >
            {Object.entries(MainnetPerpMarkets.slice(0, 1)).map(
              ([index, market]) => (
                <option key={index} value={index}>
                  {market.symbol}
                </option>
              )
            )}
          </select>
        </div>

        <div className="w-full">
          <LineTabs
            tabs={orders?.map((order) => ({
              label: order.label,
              value: order.slug,
            }))}
            activeTab={activeTab}
            setActiveTab={(tab) => setActiveTab(tab as string)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary/60 mb-2">
            Position Direction
          </label>
          <div className="flex gap-4">
            <button
              className={`flex-1 py-2 px-4 rounded-lg ${
                orderDetails.direction === PositionDirection.LONG
                  ? "bg-green-500 text-white"
                  : "bg-primary/5"
              }`}
              onClick={() => handleDirectionChange(PositionDirection.LONG)}
            >
              Long
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-lg ${
                orderDetails.direction === PositionDirection.SHORT
                  ? "bg-red-500 text-white"
                  : "bg-primary/5"
              }`}
              onClick={() => handleDirectionChange(PositionDirection.SHORT)}
            >
              Short
            </button>
          </div>
        </div>

        {/* Size Input with SOL conversion */}
        <div>
          <label className="block text-sm font-medium text-primary/60 mb-2">
            Size (USDC)
          </label>
          <div className="relative">
            <input
              type="number"
              value={orderDetails.size}
              onChange={(e) =>
                setOrderDetails({ ...orderDetails, size: e.target.value })
              }
              placeholder="0.00"
              className="w-full px-2 py-2 bg-primary/5 border border-primary/10 rounded-lg focus:outline-none focus:border-primary/20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-primary/60">
              ≈ {solAmount.toFixed(4)} SOL
            </div>
          </div>
          <div className="mt-1 text-xs text-primary/40">
            SOL Price: ${solPrice.toFixed(2)}
          </div>
        </div>

        {/* Price Input (for Limit Orders) */}
        {activeTab === "limit" && (
          <div>
            <label className="block text-sm font-medium text-primary/60 mb-2">
              Limit Price
            </label>
            <input
              type="number"
              value={orderDetails.price}
              onChange={(e) =>
                setOrderDetails({ ...orderDetails, price: e.target.value })
              }
              placeholder="0.00"
              className="w-full px-2 py-2 bg-primary/5 border border-primary/10 rounded-lg focus:outline-none focus:border-primary/20"
            />
          </div>
        )}

        {/* Market Order Transaction Info */}
        {activeTab === "market" && (
          <div className="bg-primary/5 p-4 rounded-lg space-y-2">
            <div className="text-sm font-medium text-primary/80">
              Transaction Info
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-primary/60">Current SOL Price:</span>
                <span className="font-medium">${solPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-primary/60">Auction Start Price:</span>
                <span className="font-medium">
                  $
                  {
                    calculateAuctionPrices(orderDetails.direction, solPrice)
                      .startPrice
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-primary/60">Auction End Price:</span>
                <span className="font-medium">
                  $
                  {
                    calculateAuctionPrices(orderDetails.direction, solPrice)
                      .endPrice
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-primary/60">Auction Duration:</span>
                <span className="font-medium">60 slots (~30 seconds)</span>
              </div>
              <div className="text-xs text-primary/60 mt-2 pt-2 border-t border-primary/10">
                {orderDetails.direction === PositionDirection.LONG ? (
                  <span>
                    ℹ️ Your LONG order will execute from $
                    {
                      calculateAuctionPrices(orderDetails.direction, solPrice)
                        .startPrice
                    }{" "}
                    to $
                    {
                      calculateAuctionPrices(orderDetails.direction, solPrice)
                        .endPrice
                    }{" "}
                    over 30 seconds
                  </span>
                ) : (
                  <span>
                    ℹ️ Your SHORT order will execute from $
                    {
                      calculateAuctionPrices(orderDetails.direction, solPrice)
                        .startPrice
                    }{" "}
                    to $
                    {
                      calculateAuctionPrices(orderDetails.direction, solPrice)
                        .endPrice
                    }{" "}
                    over 30 seconds
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handlePlaceOrder}
            disabled={
              isLoading ||
              !orderDetails.size ||
              (activeTab === "limit" && !orderDetails.price)
            }
          >
            {isLoading ? "Placing Order..." : "Place Order"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
