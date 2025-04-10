"use client";

import { useState } from "react";
import { WalletInput } from "../WalletInput";
import { SubaccountsList } from "./index";
import useWalletConnect from "@/hooks/useWalletConnect";
import { NotConnectedState } from "./NotConnectedState";
import { Tabs } from "@/components/UI";

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
        {/* <button
          onClick={() => setActiveTab("my-accounts")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "my-accounts"
              ? "bg-primary text-background"
              : "text-primary/60 hover:text-primary"
          }`}
        >
          My Subaccounts
        </button>
        <button
          onClick={() => setActiveTab("other-wallet")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "other-wallet"
              ? "bg-primary text-background"
              : "text-primary/60 hover:text-primary"
          }`}
        >
          View Other Wallet
        </button> */}
        <Tabs
          tabs={[
            { label: "My Subaccounts", value: "my-accounts" },
            { label: "View Other Wallet", value: "other-wallet" },
          ]}
          activeTab={activeTab}
          setActiveTab={(tab) => setActiveTab(tab as Tab)}
        />
      </div>

      {/* Tab Content */}
      {activeTab === "my-accounts" ? (
        <SubaccountsList isWalletInput={false} />
      ) : (
        <div>
          <WalletInput />
          <SubaccountsList isWalletInput={true} />
        </div>
      )}
    </div>
  );
};
