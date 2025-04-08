import {
  PerpPosition,
  BASE_PRECISION_EXP,
  QUOTE_PRECISION_EXP,
  MainnetPerpMarkets,
} from "@drift-labs/sdk";
import { BN } from "@drift-labs/sdk";

interface PerpPositionsProps {
  positions: PerpPosition[];
}

const formatBaseSize = (baseSize: BN, marketIndex: number): string => {
  const value = Number(baseSize.toString()) / Math.pow(10, BASE_PRECISION_EXP);
  const market = MainnetPerpMarkets[marketIndex];
  const symbol = market?.baseAssetSymbol || `PERP-${marketIndex}`;
  return `${value.toFixed(3)} ${symbol}`;
};

const formatPrice = (position: PerpPosition): string => {
  if (position.baseAssetAmount.isZero()) return "0.00";

  // Convert to numbers with proper precision and use absolute values
  const quoteEntry =
    Number(position.quoteEntryAmount.abs().toString()) /
    Math.pow(10, QUOTE_PRECISION_EXP);
  const baseAmount =
    Number(position.baseAssetAmount.abs().toString()) /
    Math.pow(10, BASE_PRECISION_EXP);

  const price = quoteEntry / baseAmount;
  return price.toFixed(2);
};

const formatUSDValue = (value: BN): string => {
  const usdValue = Number(value.toString()) / Math.pow(10, QUOTE_PRECISION_EXP);
  return usdValue.toFixed(2);
};

export const PerpPositions = ({ positions }: PerpPositionsProps) => {
  // Filter out positions with zero base asset amount
  const activePositions = positions.filter(
    (position) => !position.baseAssetAmount.isZero()
  );

  if (activePositions.length === 0) {
    return (
      <div className="text-center p-4 bg-primary/5 rounded-xl">
        <p className="text-primary/60">No active perpetual positions</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activePositions.map((position, index) => {
        const isLong = !position.baseAssetAmount.isNeg();
        const baseSize = position.baseAssetAmount.abs();
        const market = MainnetPerpMarkets[position.marketIndex];
        const marketName = market?.symbol || `PERP-${position.marketIndex}`;

        // Calculate entry price using the position data
        const entryPrice = formatPrice(position);

        // Calculate unrealized PnL
        const unrealizedPnl = position.quoteAssetAmount.sub(
          position.quoteBreakEvenAmount
        );

        return (
          <div key={index} className="bg-primary/5 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-primary/60">{marketName}</span>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isLong
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {isLong ? "Long" : "Short"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-primary/60 mb-1">Size</div>
                <div className="font-semibold">
                  {formatBaseSize(baseSize, position.marketIndex)}
                </div>
              </div>
              <div>
                <div className="text-sm text-primary/60 mb-1">Entry Price</div>
                <div className="font-semibold">${entryPrice}</div>
              </div>
              <div>
                <div className="text-sm text-primary/60 mb-1">
                  Unrealized PnL
                </div>
                <div
                  className={`font-semibold ${
                    unrealizedPnl.isNeg() ? "text-red-400" : "text-green-400"
                  }`}
                >
                  ${formatUSDValue(unrealizedPnl)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
