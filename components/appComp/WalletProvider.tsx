"use client";

import React from "react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import { walletMetadata, PROJECT_ID } from "@/utils/walletConfig";
import Navbar from "./Navbar";
import { Toaster } from "sonner";

const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solana],
  metadata: walletMetadata,
  projectId: PROJECT_ID,
  features: {
    socials: [],
    email: false,
  },
});

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="max-w-5xl mx-auto px-4">
      <Toaster />
      <Navbar />
      {children}
    </main>
  );
};

export default WalletProvider;
