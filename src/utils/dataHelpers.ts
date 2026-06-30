import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchData, UserProfileSummary } from "@/types";

const platformData: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

export function getSearchData(platform: Platform): SearchData {
  return platformData[platform];
}

export function extractProfiles(platform: Platform): UserProfileSummary[] {
  const data = getSearchData(platform);
  return data.accounts.map((item) => item.account.user_profile);
}

export function filterProfiles(
  profiles: UserProfileSummary[],
  query: string
): UserProfileSummary[] {
  if (!query.trim()) return profiles;
  const normalizedQuery = query.trim().toLowerCase();
  return profiles.filter((p) => {
    const matchUsername = p.username.toLowerCase().includes(normalizedQuery);
    const matchFullname = p.fullname.toLowerCase().includes(normalizedQuery);
    return matchUsername || matchFullname;
  });
}

export function findProfileByUsername(
  username: string,
  platform: Platform
): UserProfileSummary | undefined {
  const normalizedUsername = username.toLowerCase();
  return extractProfiles(platform).find(
    (p) => p.username.toLowerCase() === normalizedUsername
  );
}

export const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

export function getPlatformLabel(platform: Platform): string {
  if (platform === "instagram") return "Instagram";
  if (platform === "youtube") return "YouTube";
  return "TikTok";
}
