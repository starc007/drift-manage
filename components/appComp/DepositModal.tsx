import { useState } from "react";
import { Modal } from "@/components/UI";
import { Button } from "@/components/UI";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import useWalletConnect from "@/hooks/useWalletConnect";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositModal = ({ isOpen, onClose }: DepositModalProps) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    subAccounts,
    userAssets,
    driftClient,
    getUserAssets,
    getUserSubAccounts,
  } = useAppStore();
  const [selectedSubaccount, setSelectedSubaccount] = useState(
    subAccounts[0]?.subAccountId || 0
  );
  const { address } = useWalletConnect();
  const [selectedAsset, setSelectedAsset] = useState<IUserAsset | null>(
    userAssets.find((asset) => asset.symbol === "USDC") || null
  );

  const handleDeposit = async () => {
    try {
      if (!driftClient) {
        toast.error("Drift client not initialized");
        return;
      }
      setIsLoading(true);
      const marketIndex = 0; // USDC
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
      await driftClient?.deposit(
        precisionAmount,
        marketIndex,
        associatedTokenAccount,
        selectedSubaccount
      );
      await Promise.all([
        getUserAssets(address!),
        getUserSubAccounts(address!),
      ]);
      toast.success("Deposit successful");
    } catch (error) {
      console.error("Deposit failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} close={onClose} title="Deposit USDC" showCloseButton>
      <p className="text-sm text-yellow-500 text-center mt-3">
        ONLY DEPOSIT USDC TO THE SPOT MARKET
      </p>
      <div className="space-y-6 mt-4">
        {/* Asset Selection */}
        <div>
          <label className="block text-sm font-medium text-primary/60 mb-2">
            Select Asset
          </label>
          <select
            value={selectedAsset?.tokenAddress || ""}
            onChange={(e) =>
              setSelectedAsset(
                userAssets.find(
                  (asset) => asset.tokenAddress === e.target.value
                ) || null
              )
            }
            className="w-full px-2 py-2 bg-primary/5 border border-primary/10 rounded-lg focus:outline-none focus:border-primary/20"
          >
            <option value="">Select an asset</option>
            {userAssets.map((asset) => (
              <option key={asset.tokenAddress} value={asset.tokenAddress}>
                {asset.symbol} ({asset.balance.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

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
                {account.name.length > 0
                  ? String.fromCharCode(...account.name).trim()
                  : `Subaccount ${account.subAccountId}`}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-primary/60 mb-2">
            Amount ({selectedAsset?.symbol || "USDC"})
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
              ? `${selectedAsset.balance.toFixed(2)} ${selectedAsset.symbol}`
              : "0.00 USDC"}
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
            onClick={handleDeposit}
            disabled={
              isLoading || !amount || Number(amount) <= 0 || !selectedAsset
            }
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
