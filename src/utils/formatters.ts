import type { Platform } from "@/types";

export function formatFollowers(count: number): string {
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1) + "M";
  }
  if (count >= 1_000) {
    return (count / 1_000).toFixed(1) + "K";
  }
  return count.toLocaleString();
}

export function getAudienceCountLabel(
  platform: Platform,
  capitalized = false
): string {
  const label = platform === "youtube" ? "subscribers" : "followers";
  return capitalized
    ? label.charAt(0).toUpperCase() + label.slice(1)
    : label;
}

export function formatFollowersLabel(
  count: number,
  platform?: Platform
): string {
  const label = platform ? getAudienceCountLabel(platform) : "followers";
  return `${formatFollowers(count)} ${label}`;
}

export function formatEngagementRate(rate: number | undefined): string {
  if (rate === undefined) return "N/A";
  return (rate * 100).toFixed(2) + "%";
}
