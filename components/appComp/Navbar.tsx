"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/UI";
import useWalletConnect from "@/hooks/useWalletConnect";
import { truncateAddress } from "@/utils/utils";
import { toast } from "sonner";
import { AiOutlineLogout } from "react-icons/ai";
import { useDriftInitialize } from "@/hooks/useDriftInitialize";
import { useAppStore } from "@/store";

const Navbar = () => {
  const { connectWallet, disconnectWallet, address, isConnected, connection } =
    useWalletConnect();
  const { reset } = useAppStore();
  const { isInitialized } = useDriftInitialize(
    address || null,
    connection || null
  );

  const handleDisconnect = () => {
    disconnectWallet();
    reset();
  };

  return (
    <nav className="h-16 px-4 border-b border-primary/5 fixed top-0 left-0 right-0 backdrop-blur-3xl bg-background/50">
      <div className="max-w-5xl mx-auto flex justify-between items-center h-full">
        <Link href="/" className="text-2xl font-bold">
          dRift
        </Link>
        {isConnected && address ? (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                toast.success("Copied to clipboard");
                navigator.clipboard.writeText(address);
              }}
            >
              {truncateAddress(address)}
            </Button>
            <Button variant="secondary" onClick={handleDisconnect}>
              <AiOutlineLogout size={20} />
            </Button>
          </div>
        ) : (
          <Button onClick={connectWallet}>Connect Wallet</Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
