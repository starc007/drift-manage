import type { StateCreator } from "zustand";

export interface IUserStore {
  address: string;
  isConnected: boolean;
  isDriftInitialized: boolean;
}

const initialState: IUserStore = {
  address: "",
  isConnected: false,
  isDriftInitialized: false,
};

export const createUserStore: StateCreator<IUserStore, [], [], IUserStore> = (
  set
) => ({
  ...initialState,
});
