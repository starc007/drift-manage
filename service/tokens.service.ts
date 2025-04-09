import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from "axios";
class TokensService {
  private RPC_URL: string = process.env.NEXT_PUBLIC_RPC_URL || "";

  static convertToDecimal(balance: string, decimals: number) {
    return Number(balance) / 10 ** decimals;
  }

  async getAllAssetWithMetadata(address: string) {
    if (!this.RPC_URL) {
      throw new Error("RPC_URL is not set");
    }

    const params = {
      jsonrpc: "2.0",
      id: "wave-fetch",
      method: "searchAssets",
      params: {
        ownerAddress: address,
        page: 1,
        tokenType: "fungible",
        limit: 50,
        sortBy: {
          sortBy: "created",
          sortDirection: "asc",
        },
        options: {
          showNativeBalance: true,
        },
      },
    };

    try {
      const response = await axios.post(this.RPC_URL, params);
      const formattedResponse = response?.data?.result?.items?.map(
        (asset: any) => ({
          tokenAddress: asset?.id,
          balance: TokensService.convertToDecimal(
            asset?.token_info?.balance,
            asset?.token_info?.decimals
          ),
          decimals: asset?.token_info?.decimals,
          logoURI: asset?.content?.links?.image,
          name: asset?.content?.metadata?.name,
          symbol: asset?.content?.metadata?.symbol,
          price: Number(asset?.token_info?.price_info?.price_per_token || 0),
          value: Number(asset?.token_info?.price_info?.total_price || 0),
          previousPrice: 0,
          previousValue: 0,
          percentageChange24h: 0,
        })
      );

      const nativeBalObj = {
        tokenAddress: "So11111111111111111111111111111111111111112",
        balance:
          response?.data?.result?.nativeBalance.lamports / LAMPORTS_PER_SOL,
        decimals: 9,
        price: Number(response?.data?.result?.nativeBalance.price_per_sol || 0),
        value: Number(response?.data?.result?.nativeBalance.total_price || 0),
        name: "Solana",
        symbol: "SOL",
        logoURI:
          "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
        previousPrice: 0,
        previousValue: 0,
        percentageChange24h: 0,
      };

      // Combine and calculate all assets
      const allAssets = [nativeBalObj, ...formattedResponse]
        .sort((a, b) => b.value - a.value)
        .filter((asset) => asset.value !== 0 && asset.balance !== 0);

      return allAssets;
    } catch (error) {
      console.error("Error fetching token assets:", error);
      return [];
    }
  }
}

export const tokenService = new TokensService();
