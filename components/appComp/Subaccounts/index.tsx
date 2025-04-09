"use client";

import { useAppStore } from "@/store";
import useWalletConnect from "@/hooks/useWalletConnect";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";
import { SubaccountCard } from "./SubaccountCard";
import { TotalValue } from "./TotalValue";
import { WalletInput } from "../WalletInput";

export const SubaccountsList = ({
  isWalletInput,
}: {
  isWalletInput: boolean;
}) => {
  const {
    subAccounts,
    inputAddressAccounts,
    isLoading,
    isUserAccountExists,
    isInputAccountExists,
  } = useAppStore();
  const { isConnected } = useWalletConnect();

  // Select which accounts to display based on mode
  const accounts = isWalletInput ? inputAddressAccounts : subAccounts;
  const hasAccounts = isWalletInput
    ? isInputAccountExists
    : isUserAccountExists;

  return (
    <div>
      {!isConnected && <WalletInput />}
      {isLoading && <LoadingState />}
      {!hasAccounts && !isLoading && (
        <EmptyState
          message={
            isWalletInput
              ? "No subaccounts found for this address"
              : "No subaccounts found for your wallet"
          }
        />
      )}
      {hasAccounts && (
        <>
          <TotalValue accounts={accounts} />
          <div className="grid lg:grid-cols-2 gap-4">
            {accounts.map((account) => (
              <SubaccountCard key={account.subAccountId} account={account} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
