import React from "react";
import Link from "next/link";
import { Button } from "./UI/Button";
import useWalletConnect from "@/hooks/useWalletConnect";
import { truncateAddress } from "@/utils/utils";
import { toast } from "sonner";
import { AiOutlineLogout } from "react-icons/ai";
const Navbar = () => {
  const { connectWallet, disconnectWallet, address, isConnected } =
    useWalletConnect();

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
