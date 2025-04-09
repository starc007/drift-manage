import type { StateCreator } from "zustand";
import { DriftClient, PublicKey, UserAccount } from "@drift-labs/sdk";
import { toast } from "sonner";
import { tokenService } from "@/service/tokens.service";

export interface IUserStore {
  isUserAccountExists: boolean;
  isInputAccountExists: boolean;
  driftClient: DriftClient | null;
  subAccounts: UserAccount[];
  inputAddressAccounts: UserAccount[];
  isLoading: boolean;
  userAssets: IUserAsset[];

  // actions
  getUserSubAccounts: (address: string) => Promise<void>;
  getInputAddressAccounts: (address: string) => Promise<void>;
  setDriftClient: (driftClient: DriftClient) => void;
  reset: () => void;
  getUserAssets: (address: string) => Promise<void>;
}

const initialState = {
  isUserAccountExists: false,
  isInputAccountExists: false,
  driftClient: null,
  subAccounts: [],
  inputAddressAccounts: [],
  isLoading: false,
  userAssets: [],
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

  getInputAddressAccounts: async (address) => {
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

      set({
        isInputAccountExists: userAccounts.length > 0,
        inputAddressAccounts: userAccounts,
      });
    } catch (error) {
      console.error("Failed to fetch input address accounts:", error);
      toast.error("Failed to fetch input address accounts");
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

  getUserAssets: async (address) => {
    const { driftClient } = get();
    if (!driftClient) {
      toast.error("Drift client not initialized");
      return;
    }

    try {
      set({ isLoading: true });
      const userAssets = await tokenService.getAllAssetWithMetadata(address);

      set({ userAssets });
    } catch (error) {
      console.error("Failed to fetch user assets:", error);
      toast.error("Failed to fetch user assets");
    } finally {
      set({ isLoading: false });
    }
  },
});
