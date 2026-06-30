import type { Platform } from "@/types";
import { PLATFORMS } from "@/utils/dataHelpers";

export function parsePlatformParam(
  value: string | null,
  fallback: Platform = "instagram"
): Platform {
  if (value && PLATFORMS.includes(value as Platform)) {
    return value as Platform;
  }
  return fallback;
}

export function parsePlatformParamNullable(
  value: string | null
): Platform | null {
  if (value && PLATFORMS.includes(value as Platform)) {
    return value as Platform;
  }
  return null;
}

export function buildSearchUrl(
  platform?: Platform | null,
  query?: string
): string {
  const params = new URLSearchParams();
  if (platform) {
    params.set("platform", platform);
  }
  if (query?.trim()) {
    params.set("q", query.trim());
  }
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}
