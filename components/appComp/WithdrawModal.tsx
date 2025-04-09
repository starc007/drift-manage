import { useState } from "react";
import { Modal } from "@/components/UI";
import { Button } from "@/components/UI";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import {
  QUOTE_PRECISION_EXP,
  SpotBalanceType,
  MainnetSpotMarkets,
} from "@drift-labs/sdk";
import useWalletConnect from "@/hooks/useWalletConnect";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IWithdrawAsset {
  marketIndex: number;
  marketSymbol: string;
  balance: number;
}

export const WithdrawModal = ({ isOpen, onClose }: WithdrawModalProps) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { subAccounts, driftClient, getUserAssets, getUserSubAccounts } =
    useAppStore();
  const [selectedSubaccount, setSelectedSubaccount] = useState(
    subAccounts[0]?.subAccountId || 0
  );
  const { address } = useWalletConnect();
  const [selectedAsset, setSelectedAsset] = useState<IWithdrawAsset | null>(
    null
  );

  // Get the selected subaccount's USDC balance
  const selectedAccount = subAccounts.find(
    (account) => account.subAccountId === selectedSubaccount
  );

  // Get all non-zero spot positions
  const availableSpotPositions =
    selectedAccount?.spotPositions.filter((position) => {
      const isDeposit =
        position.balanceType.toString() === SpotBalanceType.DEPOSIT.toString();
      const hasBalance = !position.scaledBalance.isZero();
      return isDeposit && hasBalance;
    }) || [];

  // Calculate formatted balances for each position
  const spotBalances = availableSpotPositions.map((position) => ({
    marketIndex: position.marketIndex,
    marketSymbol: MainnetSpotMarkets[position.marketIndex].symbol,
    balance:
      Number(position.scaledBalance.toString()) /
      Math.pow(10, QUOTE_PRECISION_EXP),
  }));

  const handleWithdraw = async () => {
    try {
      if (!driftClient || !selectedAsset) {
        toast.error("Drift client not initialized or no asset selected");
        return;
      }
      setIsLoading(true);
      const marketIndex = selectedAsset.marketIndex;
      await driftClient.subscribe();
      const precisionAmount = driftClient?.convertToSpotPrecision(
        marketIndex,
        Number(amount)
      );
      const associatedTokenAccount =
        await driftClient?.getAssociatedTokenAccount(marketIndex);

      if (!amount || !associatedTokenAccount) {
        toast.error("Invalid amount or associated token account");
        return;
      }

      await driftClient?.withdraw(
        precisionAmount,
        marketIndex,
        associatedTokenAccount
      );

      await Promise.all([
        getUserAssets(address!),
        getUserSubAccounts(address!),
      ]);
      toast.success("Withdrawal successful");
      onClose();
    } catch (error) {
      console.error("Withdrawal failed:", error);
      toast.error("Withdrawal failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      close={onClose}
      title="Withdraw Assets"
      showCloseButton
    >
      <p className="text-sm text-yellow-500 text-center mt-3">
        Withdraw your available spot market assets
      </p>
      <div className="space-y-6 mt-4">
        {/* Subaccount Selection */}
        <div>
          <label className="block text-sm font-medium text-primary/60 mb-2">
            Withdraw from
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

        {/* Asset Selection */}
        <div>
          <label className="block text-sm font-medium text-primary/60 mb-2">
            Select Asset
          </label>
          <select
            value={selectedAsset?.marketIndex || ""}
            onChange={(e) => {
              const marketIndex = Number(e.target.value);
              const position = spotBalances.find(
                (p) => p.marketIndex === marketIndex
              );
              if (position) {
                setSelectedAsset({
                  marketIndex: position.marketIndex,
                  marketSymbol: position.marketSymbol,
                  balance: position.balance,
                });
              }
            }}
            className="w-full px-2 py-2 bg-primary/5 border border-primary/10 rounded-lg focus:outline-none focus:border-primary/20"
          >
            <option value="">Select an asset</option>
            {spotBalances.map((position) => (
              <option key={position.marketIndex} value={position.marketIndex}>
                {position.marketSymbol} ({position.balance.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-primary/60 mb-2">
            Amount
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
              onClick={() =>
                selectedAsset && setAmount(selectedAsset.balance.toString())
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-primary/60 hover:text-primary"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Balance Display */}
        <div className="flex justify-between text-sm">
          <span className="text-primary/60">Available Balance</span>
          <span className="font-medium">
            {selectedAsset
              ? `${selectedAsset.balance.toFixed(2)} (${
                  selectedAsset.marketSymbol
                })`
              : "0.00"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleWithdraw}
            disabled={
              isLoading ||
              !amount ||
              !selectedAsset ||
              Number(amount) <= 0 ||
              Number(amount) > (selectedAsset?.balance || 0)
            }
          >
            {isLoading ? "Withdrawing..." : "Withdraw"}
          </Button>
        </div>

        {/* Info Note */}
        <p className="text-sm text-primary/60 text-center">
          Note: Withdrawals will be available after transaction confirmation
        </p>
      </div>
    </Modal>
  );
};
