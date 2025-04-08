"use client";

import { useState } from "react";
import { WalletInput } from "../WalletInput";
import { SubaccountsList } from "./SubaccountsList";
import useWalletConnect from "@/hooks/useWalletConnect";

type Tab = "my-accounts" | "other-wallet";

export const TabView = () => {
  const [activeTab, setActiveTab] = useState<Tab>("my-accounts");
  const { isConnected } = useWalletConnect();

  if (!isConnected) {
    return <NotConnectedState />;
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-primary/5 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("my-accounts")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "my-accounts"
              ? "bg-blue-500 text-white"
              : "text-primary/60 hover:text-primary"
          }`}
        >
          My Subaccounts
        </button>
        <button
          onClick={() => setActiveTab("other-wallet")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "other-wallet"
              ? "bg-blue-500 text-white"
              : "text-primary/60 hover:text-primary"
          }`}
        >
          View Other Wallet
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "my-accounts" ? (
        <SubaccountsList />
      ) : (
        <div>
          <WalletInput />
          <SubaccountsList isOtherWallet />
        </div>
      )}
    </div>
  );
};
