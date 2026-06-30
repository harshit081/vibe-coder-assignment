import { getWikipediaTitle } from "@/data/wikipediaTitles";

interface WikipediaSummary {
  thumbnail?: { source: string; width?: number; height?: number };
  originalimage?: { source: string; width?: number; height?: number };
  extract?: string;
  title?: string;
}

const imageCache = new Map<string, string | null>();

export async function fetchWikipediaImage(
  username: string
): Promise<string | null> {
  const cached = imageCache.get(username);
  if (cached !== undefined) return cached;

  const title = getWikipediaTitle(username);
  if (!title) {
    imageCache.set(username, null);
    return null;
  }

  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
    );
    if (!response.ok) {
      imageCache.set(username, null);
      return null;
    }

    const data = (await response.json()) as WikipediaSummary;
    const url =
      data.originalimage?.source ?? data.thumbnail?.source ?? null;
    imageCache.set(username, url);
    return url;
  } catch {
    imageCache.set(username, null);
    return null;
  }
}
