"use client";

import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useAppStore } from "@/store";

export const WalletInput = () => {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { getUserSubAccounts } = useAppStore();

  const isValidPublicKey = (address: string) => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!address.trim()) {
      setError("Please enter a wallet address");
      return;
    }

    if (!isValidPublicKey(address.trim())) {
      setError("Invalid Solana address");
      return;
    }

    try {
      setIsLoading(true);
      await getUserSubAccounts(address.trim());
    } catch (err) {
      setError("Failed to fetch wallet data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 mb-6">
      <h2 className="text-lg font-medium mb-2">View Other Wallet</h2>
      <p className="text-primary/60 text-sm mb-4">
        Enter a Solana wallet address to view their subaccounts
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex gap-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Solana wallet address"
              className="flex-1 bg-primary/5 border border-primary/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary/20"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isLoading
                  ? "bg-primary/20 text-primary/60"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isLoading ? "Loading..." : "View"}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
      </form>
    </div>
  );
};
