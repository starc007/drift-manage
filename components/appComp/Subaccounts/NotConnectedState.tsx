import { FaWallet } from "react-icons/fa6";
import { MdAccountBalanceWallet } from "react-icons/md";
import useWalletConnect from "@/hooks/useWalletConnect";
import { Button } from "@/components/UI";

export const NotConnectedState = () => {
  const { connectWallet } = useWalletConnect();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-8 py-12">
      <div className="bg-primary/5 backdrop-blur-sm border border-primary/10 rounded-3xl p-8 max-w-md w-full">
        <div className="mb-6">
          <FaWallet className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">
            Connect your Solana wallet to view your subaccounts and manage your
            positions
          </p>
        </div>

        <Button className="w-full" onClick={connectWallet}>
          Connect Wallet
        </Button>
      </div>
    </div>
  );
};
