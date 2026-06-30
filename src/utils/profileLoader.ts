import type { Platform, ProfileDetailResponse, UserProfileSummary } from "@/types";
import {
  findProfileByUsername,
  PLATFORMS,
} from "@/utils/dataHelpers";

const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

const profilePathByUsername = new Map<string, string>();

for (const path of Object.keys(profileModules)) {
  const filename = path.split("/").pop()?.replace(/\.json$/, "");
  if (filename) {
    profilePathByUsername.set(filename.toLowerCase(), path);
  }
}

function buildSummaryResponse(
  profile: UserProfileSummary
): ProfileDetailResponse {
  return {
    data: {
      success: true,
      user_profile: { ...profile },
    },
  };
}

function findProfileAcrossPlatforms(
  username: string,
  platform?: Platform | null
): UserProfileSummary | undefined {
  if (platform) {
    return findProfileByUsername(username, platform);
  }

  for (const p of PLATFORMS) {
    const match = findProfileByUsername(username, p);
    if (match) return match;
  }

  return undefined;
}

export async function loadProfileByUsername(
  username: string,
  platform?: Platform | null
): Promise<ProfileDetailResponse | null> {
  const profilePath = profilePathByUsername.get(username.toLowerCase());
  const loader = profilePath ? profileModules[profilePath] : undefined;

  if (loader) {
    const result = await loader();
    const data =
      (result as { default?: ProfileDetailResponse }).default ?? result;
    return data as ProfileDetailResponse;
  }

  const summary = findProfileAcrossPlatforms(username, platform);
  return summary ? buildSummaryResponse(summary) : null;
}

export function isDetailedProfile(username: string): boolean {
  return profilePathByUsername.has(username.toLowerCase());
}
