import { formatBN } from "@/utils/format";
import { StatCard } from "./StatCard";
import { MarginMode } from "@drift-labs/sdk";
import { PerpPositions } from "./PerpPositions";
import { useState } from "react";
import { calculateSubaccountValue, formatUSD } from "@/utils/calculations";

export const SubaccountCard = ({ account }: SubaccountCardProps) => {
  const [showPositions, setShowPositions] = useState(false);

  // Filter active positions
  const activePositions = account.perpPositions.filter(
    (position) => !position.baseAssetAmount.isZero()
  );

  const netValue = calculateSubaccountValue(
    account.spotPositions,
    account.perpPositions,
    account.settledPerpPnl
  );

  return (
    <div className="border border-primary/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 text-blue-400 rounded-lg px-3 py-1.5">
            #{account.subAccountId}
          </div>
          <h3 className="text-lg font-medium">
            {account.name.length > 0
              ? String.fromCharCode(...account.name).trim()
              : `Subaccount ${account.subAccountId}`}
          </h3>
        </div>
        <div
          className={`px-3 py-1.5 rounded-full font-medium text-sm ${
            account.marginMode === MarginMode.DEFAULT
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-purple-500/20 text-purple-500"
          }`}
        >
          {account.marginMode === MarginMode.DEFAULT
            ? "Default"
            : "High Leverage"}
        </div>
      </div>

      {/* Net Value Display - Clean version */}
      <div className="bg-primary/5 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-primary/60">Net Value</div>
          <div
            className={`text-xl font-semibold ${
              netValue.isNeg() ? "text-red-400" : "text-green-400"
            }`}
          >
            {formatUSD(netValue)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Total Deposits"
          value={`$${formatBN(account.totalDeposits)}`}
          valueColor="text-green-400"
        />
        <StatCard
          label="Total Withdraws"
          value={`$${formatBN(account.totalWithdraws)}`}
          valueColor="text-red-400"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <StatCard
          label="Settled PnL"
          value={`$${formatBN(account.settledPerpPnl)}`}
          valueColor={
            account.settledPerpPnl.isNeg() ? "text-red-400" : "text-green-400"
          }
        />
        <StatCard
          label="Status"
          value={account.idle ? "Idle" : "Active"}
          valueColor={account.idle ? "text-primary/60" : "text-blue-400"}
        />
      </div>

      <div className="mt-4">
        <button
          onClick={() => setShowPositions(!showPositions)}
          className="w-full text-left px-4 py-2 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">
              Perpetual Positions ({activePositions.length})
            </span>
            <span className="text-primary/60">
              {showPositions ? "Hide" : "Show"}
            </span>
          </div>
        </button>

        {showPositions && (
          <div className="mt-4">
            <PerpPositions positions={account.perpPositions} />
          </div>
        )}
      </div>
    </div>
  );
};
