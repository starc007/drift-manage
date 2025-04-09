import { useEffect, useState } from "react";
import { driftService } from "@/service/drift.service";
import { useAppStore } from "@/store";
import { Connection, PublicKey } from "@solana/web3.js";
import { toast } from "sonner";
import useWalletConnect from "./useWalletConnect";
import { IWallet } from "@drift-labs/sdk";

export const useDriftInitialize = (
  address: string | null,
  connection: Connection | null
) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { getUserSubAccounts, setDriftClient, getUserAssets } = useAppStore();
  const { walletProvider } = useWalletConnect();

  useEffect(() => {
    const initializeDrift = async () => {
      if (!address || !connection) {
        setIsInitialized(false);
        return;
      }

      if (isInitializing || isInitialized) return;

      try {
        setIsInitializing(true);
        const client = driftService.initialize(
          connection,
          address,
          walletProvider as IWallet
        );

        if (client) {
          setDriftClient(client);
          await Promise.all([
            getUserSubAccounts(address),
            getUserAssets(address),
          ]);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Failed to initialize Drift:", error);
        toast.error("Failed to initialize Drift service");
        setIsInitialized(false);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeDrift();
  }, [address, connection, isInitialized, isInitializing]);

  return {
    isInitialized,
    isInitializing,
  };
};
