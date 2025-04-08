"use client";

import { useAppStore } from "@/store";
import useWalletConnect from "@/hooks/useWalletConnect";
import { NotConnectedState } from "./NotConnectedState";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";
import { SubaccountCard } from "./SubaccountCard";
import { TotalValue } from "./TotalValue";
import { WalletInput } from "../WalletInput";

export const SubaccountsList = () => {
  const { subAccounts, isLoading, isUserAccountExists } = useAppStore();
  const { isConnected } = useWalletConnect();

  return (
    <div>
      {!isConnected && <WalletInput />}
      {isLoading ? (
        <LoadingState />
      ) : !isUserAccountExists ? (
        <EmptyState />
      ) : (
        <>
          <TotalValue />
          <div className="grid lg:grid-cols-2 gap-4">
            {subAccounts.map((account) => (
              <SubaccountCard key={account.subAccountId} account={account} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export * from "./types";
