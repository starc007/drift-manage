import { calculateSubaccountValue, formatUSD } from "@/utils/calculations";
import { BN, UserAccount } from "@drift-labs/sdk";
import { Button } from "@/components/UI";
import { useState } from "react";
import { DepositModal } from "../DepositModal";
import { WithdrawModal } from "../WithdrawModal";
interface Props {
  accounts: UserAccount[];
}

export const TotalValue = ({ accounts }: Props) => {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const totalValue = accounts.reduce((acc, account) => {
    const accountValue = calculateSubaccountValue(
      account.spotPositions,
      account.perpPositions,
      account.settledPerpPnl,
      account.totalDeposits,
      account.totalWithdraws
    );
    return acc.add(accountValue);
  }, new BN(0));

  return (
    <>
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium mb-1">Total Portfolio Value</h2>
            <p className="text-primary/60 text-sm">
              Combined value across {accounts.length} subaccounts
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

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="primary" onClick={() => setIsDepositModalOpen(true)}>
            Deposit
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsWithdrawModalOpen(true)}
          >
            Withdraw
          </Button>
        </div>
      </div>
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
      />
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
      />
    </>
  );
};
