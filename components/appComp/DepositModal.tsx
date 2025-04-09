import { useState } from "react";
import { Modal } from "@/components/UI";
import { Button } from "@/components/UI";
import { useAppStore } from "@/store";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositModal = ({ isOpen, onClose }: DepositModalProps) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { subAccounts } = useAppStore();
  const [selectedSubaccount, setSelectedSubaccount] = useState(
    subAccounts[0]?.subAccountId || 0
  );

  const handleDeposit = async () => {
    try {
      setIsLoading(true);
      // Deposit logic will be implemented here
    } catch (error) {
      console.error("Deposit failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} close={onClose} title="Deposit USDC" showCloseButton>
      <div className="space-y-6 mt-4">
        {/* Subaccount Selection */}
        <div>
          <label className="block text-sm font-medium text-primary/60 mb-2">
            Deposit to
          </label>
          <select
            value={selectedSubaccount}
            onChange={(e) => setSelectedSubaccount(Number(e.target.value))}
            className="w-full px-2 py-2 bg-primary/5 border border-primary/10 rounded-lg focus:outline-none focus:border-primary/20"
          >
            {subAccounts.map((account) => (
              <option key={account.subAccountId} value={account.subAccountId}>
                Subaccount #{account.subAccountId}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-primary/60 mb-2">
            Amount (USDC)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-2 py-2 bg-primary/5 border border-primary/10 rounded-lg focus:outline-none focus:border-primary/20"
            />
            <button
              onClick={() => setAmount("0")} // Will be replaced with max balance
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-primary/60 hover:text-primary"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Balance Display */}
        <div className="flex justify-between text-sm">
          <span className="text-primary/60">Available Balance</span>
          <span className="font-medium">0.00 USDC</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleDeposit}
            disabled={isLoading || !amount || Number(amount) <= 0}
          >
            {isLoading ? "Depositing..." : "Deposit"}
          </Button>
        </div>

        {/* Info Note */}
        <p className="text-sm text-primary/60 text-center">
          Note: Deposits will be available after transaction confirmation
        </p>
      </div>
    </Modal>
  );
};
