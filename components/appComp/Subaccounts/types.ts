import { UserAccount } from "@drift-labs/sdk";

export interface SubaccountCardProps {
  account: UserAccount;
}

export interface StatCardProps {
  label: string;
  value: string;
  valueColor?: string;
}
