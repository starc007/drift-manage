"use client";

import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useAppStore } from "@/store";
import { Button } from "@/components/UI";

export const WalletInput = () => {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { getInputAddressAccounts } = useAppStore();

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
      await getInputAddressAccounts(address.trim());
    } catch (err) {
      setError("Failed to fetch wallet data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <div className="bg-primary/5 rounded-xl p-6">
        <h2 className="text-xl font-medium mb-2">View Wallet Data</h2>
        <p className="text-primary/60 mb-4">
          Input a wallet address to view its subaccounts and positions
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Solana wallet address"
              className="w-full px-4 py-2 bg-primary/5 border border-primary/10 rounded-lg focus:outline-none focus:border-primary/20"
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>

          <Button type="submit" className="w-fit" disabled={isLoading}>
            {isLoading ? "Loading..." : "View Wallet"}
          </Button>
        </form>
      </div>
    </div>
  );
};
