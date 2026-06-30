import { useEffect, useState } from "react";
import { fetchWikipediaImage } from "@/utils/wikipedia";

interface WikiResult {
  key: string;
  wikiSrc: string | null;
}

export function useHeroPortrait(username: string, fallbackSrc: string) {
  const fetchKey = `${username}:${fallbackSrc}`;
  const [result, setResult] = useState<WikiResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchWikipediaImage(username).then((url) => {
      if (cancelled) return;
      setResult({ key: fetchKey, wikiSrc: url });
    });

    return () => {
      cancelled = true;
    };
  }, [username, fallbackSrc, fetchKey]);

  const isReady = result?.key === fetchKey;

  if (!isReady) {
    return {
      displaySrc: null,
      isWikipedia: false,
      loading: true,
    };
  }

  const wikiSrc = result.wikiSrc;

  return {
    displaySrc: wikiSrc ?? fallbackSrc,
    isWikipedia: Boolean(wikiSrc),
    loading: false,
  };
}
