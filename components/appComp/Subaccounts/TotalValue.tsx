import { useAppStore } from "@/store";
import { calculateSubaccountValue, formatUSD } from "@/utils/calculations";
import { BN } from "@drift-labs/sdk";

export const TotalValue = () => {
  const { subAccounts } = useAppStore();

  const totalValue = subAccounts.reduce((acc, account) => {
    const accountValue = calculateSubaccountValue(
      account.spotPositions,
      account.perpPositions,
      account.settledPerpPnl
    );
    return acc.add(accountValue);
  }, new BN(0));

  return (
    <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium mb-1">Total Portfolio Value</h2>
          <p className="text-primary/60 text-sm">
            Combined value across {subAccounts.length} subaccounts
          </p>
        </div>
        <div
          className={`text-2xl font-bold ${
            totalValue.isNeg() ? "text-red-400" : "text-green-400"
          }`}
        >
          {formatUSD(totalValue)}
        </div>
      </div>

      {/* Optional: Show breakdown by subaccount */}
      <div className="mt-4 space-y-2">
        {subAccounts.map((account) => {
          const value = calculateSubaccountValue(
            account.spotPositions,
            account.perpPositions,
            account.settledPerpPnl
          );
          return (
            <div
              key={account.subAccountId}
              className="flex justify-between text-sm text-primary/60"
            >
              <span>Subaccount #{account.subAccountId}</span>
              <span>{formatUSD(value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
