import { BN } from "@drift-labs/sdk";

export const formatBN = (bn: BN, decimals = 6): string => {
  if (!bn) return "0";
  const str = bn.toString();
  const negative = str.startsWith("-");
  const absStr = negative ? str.slice(1) : str;
  const padded = absStr.padStart(decimals + 1, "0");
  const intPart = padded.slice(0, -decimals) || "0";
  const decimalPart = padded.slice(-decimals);
  const formatted = `${negative ? "-" : ""}${intPart}.${decimalPart}`;
  return parseFloat(formatted).toFixed(2);
};
