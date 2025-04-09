import { UserAccount } from "@drift-labs/sdk";

export declare global {
  interface SubaccountCardProps {
    account: UserAccount;
  }

  interface StatCardProps {
    label: string;
    value: string;
    valueColor?: string;
  }

  interface IUserAsset {
    tokenAddress: string;
    balance: number;
    decimals: number;
    logoURI: string;
    name: string;
    symbol: string;
    price: number;
    value: number;
  }
}
