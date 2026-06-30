import { useState } from "react";
import type { Platform } from "@/types";
import { fetchWikipediaImage } from "@/utils/wikipedia";

interface ProfilePictureProps {
  username: string;
  src: string;
  alt: string;
  className?: string;
  platform?: Platform;
  handle?: string;
  draggable?: boolean;
}

function getYoutubeAvatarFallback(username: string, handle?: string): string {
  const id = handle || username;
  return `https://unavatar.io/youtube/${encodeURIComponent(id)}`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return (parts[0]?.slice(0, 2) ?? "?").toUpperCase();
}

export function ProfilePicture({
  username,
  src,
  alt,
  className = "",
  platform,
  handle,
  draggable = false,
}: ProfilePictureProps) {
  const [displaySrc, setDisplaySrc] = useState<string | null>(src || null);
  const [showInitials, setShowInitials] = useState(false);
  const [fallbackStage, setFallbackStage] = useState(0);

  const handleError = () => {
    if (fallbackStage === 0 && platform === "youtube") {
      setDisplaySrc(getYoutubeAvatarFallback(username, handle));
      setFallbackStage(1);
      return;
    }

    if (fallbackStage <= 1) {
      setFallbackStage(2);
      void fetchWikipediaImage(username).then((wikiSrc) => {
        if (wikiSrc) {
          setDisplaySrc(wikiSrc);
          setFallbackStage(3);
          return;
        }
        setShowInitials(true);
        setDisplaySrc(null);
      });
      return;
    }

    setShowInitials(true);
    setDisplaySrc(null);
  };

  if (showInitials || !displaySrc) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-pink-500/30 to-violet-600/30 text-white font-display font-bold ${className}`}
        aria-label={alt}
      >
        {getInitials(alt)}
      </div>
    );
  }

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      draggable={draggable}
      onError={handleError}
      referrerPolicy="no-referrer"
    />
  );
}
