import { create } from "zustand";
import { IUserStore, createUserStore } from "./stores";

export type AppState = IUserStore;

export const useAppStore = create<AppState>((...a) => ({
  ...createUserStore(...a),
}));
