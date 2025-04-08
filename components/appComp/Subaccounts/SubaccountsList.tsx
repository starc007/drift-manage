import { useAppStore } from "@/stores/appStore";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { TotalValue } from "@/components/TotalValue";
import { SubaccountCard } from "@/components/SubaccountCard";

interface SubaccountsListProps {
  isOtherWallet?: boolean;
}

export const SubaccountsList = ({
  isOtherWallet = false,
}: SubaccountsListProps) => {
  const { subAccounts, isLoading, isUserAccountExists } = useAppStore();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!isUserAccountExists) {
    return (
      <EmptyState
        message={
          isOtherWallet
            ? "Enter a wallet address to view their subaccounts"
            : "You don't have any subaccounts yet"
        }
      />
    );
  }

  return (
    <div>
      <TotalValue />
      <div className="grid lg:grid-cols-2 gap-4">
        {subAccounts.map((account) => (
          <SubaccountCard key={account.subAccountId} account={account} />
        ))}
      </div>
    </div>
  );
};
