import {
  SpotPosition,
  PerpPosition,
  BN,
  QUOTE_PRECISION_EXP,
  SpotBalanceType,
} from "@drift-labs/sdk";
import { formatBN } from "./format";

export const calculateSubaccountValue = (
  spotPositions: SpotPosition[],
  perpPositions: PerpPosition[],
  settledPerpPnl: BN
): BN => {
  try {
    // Get USDC spot position (market index 0 is USDC)
    const usdcPosition = spotPositions.find(
      (position) =>
        position.marketIndex === 0 &&
        position.balanceType === SpotBalanceType.DEPOSIT
    );
    const usdcBalance = usdcPosition ? usdcPosition.scaledBalance : new BN(0);

    // Calculate perp positions value
    const perpValue = perpPositions.reduce((acc, position) => {
      // For each position:
      // 1. quoteAssetAmount: Current value of the position
      // 2. quoteBreakEvenAmount: Cost basis of the position
      // 3. settledPnl: Already settled PnL
      const positionValue = position.quoteAssetAmount.sub(
        position.quoteBreakEvenAmount
      );
      return acc.add(positionValue);
    }, new BN(0));

    // Total value = USDC balance + Perp positions value + Total settled PnL
    const totalValue = usdcBalance
      .add(perpValue)
      .add(settledPerpPnl || new BN(0));

    return totalValue;
  } catch (error) {
    console.error("Error calculating net value:", error);
    return new BN(0);
  }
};

export const formatUSD = (bn: BN): string => {
  try {
    // Handle negative numbers
    const isNegative = bn.isNeg();
    const absoluteValue = isNegative ? bn.abs() : bn;

    // Convert to standard format considering QUOTE_PRECISION_EXP (6 decimals for USDC)
    const value =
      Number(absoluteValue.toString()) / Math.pow(10, QUOTE_PRECISION_EXP);

    // Format with 2 decimal places and add negative sign if needed
    return `$${(isNegative ? -value : value).toFixed(2)}`;
  } catch (error) {
    console.error("Error formatting USD value:", error);
    return "$0.00";
  }
};
