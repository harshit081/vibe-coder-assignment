import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RosterSortBy } from "@/utils/rosterSort";

interface RosterUiState {
  pinned: boolean;
  sortBy: RosterSortBy;
  setPinned: (pinned: boolean) => void;
  togglePinned: () => void;
  setSortBy: (sortBy: RosterSortBy) => void;
}

export const useRosterUiStore = create<RosterUiState>()(
  persist(
    (set, get) => ({
      pinned: true,
      sortBy: "custom",
      setPinned: (pinned) => set({ pinned }),
      togglePinned: () => set({ pinned: !get().pinned }),
      setSortBy: (sortBy) => set({ sortBy }),
    }),
    { name: "wobb-roster-ui" }
  )
);
