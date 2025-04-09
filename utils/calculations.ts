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
  settledPerpPnl: BN,
  totalDeposits: BN,
  totalWithdraws: BN
): BN => {
  try {
    // Total value = Total Deposits - Total Withdraws + Total settled PnL
    return totalDeposits.sub(totalWithdraws).add(settledPerpPnl || new BN(0));
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
