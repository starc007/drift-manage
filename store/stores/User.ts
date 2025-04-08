import type { StateCreator } from "zustand";
import { DriftClient, PublicKey, UserAccount } from "@drift-labs/sdk";
import { toast } from "sonner";

export interface IUserStore {
  isUserAccountExists: boolean;
  driftClient: DriftClient | null;
  subAccounts: UserAccount[];
  isLoading: boolean;

  // actions
  getUserSubAccounts: (address: string) => Promise<void>;
  setDriftClient: (driftClient: DriftClient) => void;
  reset: () => void;
}

const initialState = {
  isUserAccountExists: false,
  driftClient: null,
  subAccounts: [],
  isLoading: false,
};

export const createUserStore: StateCreator<IUserStore, [], [], IUserStore> = (
  set,
  get
) => ({
  ...initialState,
  getUserSubAccounts: async (address) => {
    const { driftClient } = get();
    if (!driftClient) {
      toast.error("Drift client not initialized");
      return;
    }

    try {
      set({ isLoading: true });
      const userAccounts = await driftClient.getUserAccountsForAuthority(
        new PublicKey(address)
      );

      console.log("userAccounts", userAccounts);

      set({
        isUserAccountExists: userAccounts.length > 0,
        subAccounts: userAccounts,
      });
    } catch (error) {
      console.error("Failed to fetch user accounts:", error);
      toast.error("Failed to fetch user accounts");
    } finally {
      set({ isLoading: false });
    }
  },
  setDriftClient: (driftClient) => {
    set({ driftClient });
  },
  reset: () => {
    set(initialState);
  },
});
