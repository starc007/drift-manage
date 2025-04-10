import { useState } from "react";
import { Modal, Button, LineTabs } from "@/components/UI";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import {
  QUOTE_PRECISION_EXP,
  MainnetPerpMarkets,
  OrderType,
  PositionDirection,
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
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("market");
  const { subAccounts, driftClient, getUserSubAccounts } = useAppStore();
  const [selectedSubaccount, setSelectedSubaccount] = useState(
    subAccounts[0]?.subAccountId || 0
  );
  const { address } = useWalletConnect();

  const handlePlaceOrder = async () => {
    try {
      if (!driftClient) {
        toast.error("Drift client not initialized");
        return;
      }
      setIsLoading(true);

      const { marketIndex, size, price, orderType, direction } = orderDetails;
      await driftClient.subscribe();

      if (orderType === OrderType.MARKET) {
        await driftClient.openPosition(
          direction,
          Number(size),
          marketIndex,
          Number(price)
        );
      } else {
        await driftClient.placePerpOrder({
          marketIndex,
          orderType,
          price: Number(price),
          baseAssetAmount: Number(size),
          direction,
        });
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
      title="Place Perpetual Order"
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
            {Object.entries(MainnetPerpMarkets).map(([index, market]) => (
              <option key={index} value={index}>
                {market.symbol}
              </option>
            ))}
          </select>
        </div>

        {/* Order Type */}
        <div>
          <label className="block text-sm font-medium text-primary/60 mb-2">
            Order Type
          </label>
          <div className="w-full">
            {/* {orders.map((order) => (
              <button
                key={order.label}
                className={`flex-1 py-2 px-4 border-b ${
                  orderDetails.orderType === order.value
                    ? "border-primary"
                    : "border-primary/5"
                }`}
                onClick={() =>
                  setOrderDetails({ ...orderDetails, orderType: order.value })
                }
              >
                {order.label}
              </button>
            ))} */}
            <LineTabs
              tabs={orders?.map((order) => ({
                label: order.label,
                value: order.slug,
              }))}
              activeTab={activeTab}
              setActiveTab={(tab) => setActiveTab(tab as string)}
            />
          </div>
        </div>

        {/* Direction */}
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
              onClick={() =>
                setOrderDetails({
                  ...orderDetails,
                  direction: PositionDirection.LONG,
                })
              }
            >
              Long
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-lg ${
                orderDetails.direction === PositionDirection.SHORT
                  ? "bg-red-500 text-white"
                  : "bg-primary/5"
              }`}
              onClick={() =>
                setOrderDetails({
                  ...orderDetails,
                  direction: PositionDirection.SHORT,
                })
              }
            >
              Short
            </button>
          </div>
        </div>

        {/* Size Input */}
        <div>
          <label className="block text-sm font-medium text-primary/60 mb-2">
            Size
          </label>
          <input
            type="number"
            value={orderDetails.size}
            onChange={(e) =>
              setOrderDetails({ ...orderDetails, size: e.target.value })
            }
            placeholder="0.00"
            className="w-full px-2 py-2 bg-primary/5 border border-primary/10 rounded-lg focus:outline-none focus:border-primary/20"
          />
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
