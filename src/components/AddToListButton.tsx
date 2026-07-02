import type { MouseEvent } from "react";
import type { Platform, UserProfileSummary } from "@/types";
import { useSelectedListStore } from "@/store/selectedListStore";
import { getPlatformTheme } from "@/theme/platformThemes";

interface AddToListButtonProps {
  profile: UserProfileSummary;
  platform: Platform;
  className?: string;
  size?: "sm" | "md";
  variant?: "default" | "showoff";
}

export function AddToListButton({
  profile,
  platform,
  className = "",
  size = "sm",
  variant = "default",
}: AddToListButtonProps) {
  const theme = getPlatformTheme(platform);
  const addProfile = useSelectedListStore((state) => state.addProfile);
  const isSelected = useSelectedListStore((state) =>
    state.isSelected(platform, profile.username)
  );

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!isSelected) {
      addProfile(profile, platform);
    }
  };

  const sizeClasses =
    size === "md"
      ? "px-4 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm"
      : "px-3 py-1.5 text-[11px] sm:px-3.5 sm:text-xs";

  if (isSelected) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-default ${sizeClasses} ${className}`}
      >
        <span aria-hidden="true">✓</span> In roster
      </button>
    );
  }

  if (variant === "showoff") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center rounded-full font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${sizeClasses} ${className}`}
        style={{
          background: theme.gradient,
          boxShadow: `0 8px 32px -8px ${theme.glow}`,
        }}
      >
        + Add to roster
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Add ${profile.username} to list`}
      className={`inline-flex items-center rounded-full font-semibold text-white transition-all hover:opacity-90 active:scale-95 ${sizeClasses} ${className}`}
      style={{ background: theme.gradient }}
    >
      + Add
    </button>
  );
}
