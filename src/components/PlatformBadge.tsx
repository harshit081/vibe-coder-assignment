import type { Platform } from "@/types";
import { getPlatformTheme } from "@/theme/platformThemes";

interface PlatformBadgeProps {
  platform: Platform;
  className?: string;
}

export function PlatformBadge({ platform, className = "" }: PlatformBadgeProps) {
  const theme = getPlatformTheme(platform);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-lg sm:px-3 sm:py-1 sm:text-xs ${theme.badge} ${className}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-white/90"
        aria-hidden="true"
      />
      {theme.label}
    </span>
  );
}
