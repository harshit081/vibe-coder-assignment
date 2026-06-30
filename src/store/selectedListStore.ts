import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, SelectedProfile, UserProfileSummary } from "@/types";
import { getSelectedProfileId } from "@/utils/selectedProfileId";

interface SelectedListState {
  profiles: SelectedProfile[];
  addProfile: (profile: UserProfileSummary, platform: Platform) => boolean;
  removeProfile: (id: string) => void;
  reorderProfiles: (startIndex: number, endIndex: number) => void;
  clearList: () => void;
  isSelected: (platform: Platform, username: string) => boolean;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export const useSelectedListStore = create<SelectedListState>()(
  persist(
    (set, get) => ({
      profiles: [],

      addProfile: (profile, platform) => {
        const id = getSelectedProfileId(platform, profile.username);
        if (get().profiles.some((item) => item.id === id)) {
          return false;
        }

        set((state) => ({
          profiles: [
            ...state.profiles,
            { id, platform, profile, addedAt: Date.now() },
          ],
        }));
        return true;
      },

      removeProfile: (id) => {
        set((state) => ({
          profiles: state.profiles.filter((item) => item.id !== id),
        }));
      },

      reorderProfiles: (startIndex, endIndex) => {
        if (startIndex === endIndex) return;

        set((state) => ({
          profiles: reorder(state.profiles, startIndex, endIndex),
        }));
      },

      clearList: () => set({ profiles: [] }),

      isSelected: (platform, username) => {
        const id = getSelectedProfileId(platform, username);
        return get().profiles.some((item) => item.id === id);
      },
    }),
    {
      name: "wobb-selected-profiles",
      partialize: (state) => ({ profiles: state.profiles }),
    }
  )
);

export function useSelectedListCount() {
  return useSelectedListStore((state) => state.profiles.length);
}
