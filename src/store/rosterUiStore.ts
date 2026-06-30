import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RosterUiState {
  pinned: boolean;
  setPinned: (pinned: boolean) => void;
  togglePinned: () => void;
}

export const useRosterUiStore = create<RosterUiState>()(
  persist(
    (set, get) => ({
      pinned: true,
      setPinned: (pinned) => set({ pinned }),
      togglePinned: () => set({ pinned: !get().pinned }),
    }),
    { name: "wobb-roster-ui" }
  )
);
