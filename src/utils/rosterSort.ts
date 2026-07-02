import type { Platform, SelectedProfile } from "@/types";

export type RosterSortBy = "custom" | "name" | "followers" | "platform";

export type RosterSortOption = Exclude<RosterSortBy, "custom">;

const PLATFORM_ORDER: Record<Platform, number> = {
  instagram: 0,
  youtube: 1,
  tiktok: 2,
};

export function sortRosterProfiles(
  profiles: SelectedProfile[],
  sortBy: RosterSortOption
): SelectedProfile[] {
  const sorted = [...profiles];

  switch (sortBy) {
    case "name":
      sorted.sort((a, b) =>
        a.profile.fullname.localeCompare(b.profile.fullname, undefined, {
          sensitivity: "base",
        })
      );
      break;
    case "followers":
      sorted.sort((a, b) => b.profile.followers - a.profile.followers);
      break;
    case "platform":
      sorted.sort((a, b) => {
        const platformDiff =
          PLATFORM_ORDER[a.platform] - PLATFORM_ORDER[b.platform];
        if (platformDiff !== 0) return platformDiff;
        return b.profile.followers - a.profile.followers;
      });
      break;
  }

  return sorted;
}

export const ROSTER_SORT_LABELS: Record<RosterSortBy, string> = {
  custom: "Custom order",
  name: "Name (A–Z)",
  followers: "Subscribers (high–low)",
  platform: "Platform (IG → YT → TikTok)",
};
