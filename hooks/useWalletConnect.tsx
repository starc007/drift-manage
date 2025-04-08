import {
  useAppKit,
  useAppKitAccount,
  useAppKitProvider,
  useDisconnect,
} from "@reown/appkit/react";
import {
  useAppKitConnection,
  type Provider,
} from "@reown/appkit-adapter-solana/react";

const useWalletConnect = () => {
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const { address, isConnected } = useAppKitAccount();
  const { connection } = useAppKitConnection();

  const connectWallet = () => {
    open();
  };

  const disconnectWallet = () => {
    disconnect();
  };

  return {
    connectWallet,
    disconnectWallet,
    walletProvider,
    address,
    isConnected,
    connection,
  };
};

export default useWalletConnect;
