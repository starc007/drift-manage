"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./UI/Button";
import useWalletConnect from "@/hooks/useWalletConnect";
import { truncateAddress } from "@/utils/utils";
import { toast } from "sonner";
import { AiOutlineLogout } from "react-icons/ai";
import { driftService } from "@/service/drift.service";
const Navbar = () => {
  const {
    connectWallet,
    disconnectWallet,
    address,
    isConnected,
    connection,
    walletProvider,
  } = useWalletConnect();

  const [isDriftInitialized, setIsDriftInitialized] = useState(false);

  console.log("isDriftInitialized", isDriftInitialized);

  const initializeDriftService = async () => {
    if (!address) return;
    const isInitialized = driftService.initialize(connection!, address);
    setIsDriftInitialized(isInitialized);
  };

  const getUserStats = async () => {
    if (!address) return;
    console.log("getting user stats");
    const userStats = await driftService.getUserAccounts(address);
    console.log("userStats", userStats);
  };

  useEffect(() => {
    if (!isDriftInitialized) {
      console.log("initializing drift service");
      initializeDriftService();
    }

    if (isDriftInitialized) {
      getUserStats();
    }
  }, [address, isDriftInitialized, connection, walletProvider]);

  return (
    <nav className="flex justify-between items-center p-4">
      <Link href="/" className="text-2xl font-bold">
        dRift
      </Link>
      {isConnected && address ? (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              toast.success("Copied to clipboard");
              navigator.clipboard.writeText(address!);
            }}
          >
            {truncateAddress(address!)}
          </Button>
          <Button variant="secondary" onClick={disconnectWallet}>
            <AiOutlineLogout size={20} />
          </Button>
        </div>
      ) : (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      )}
    </nav>
  );
};

export default Navbar;
