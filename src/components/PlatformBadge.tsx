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
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg ${theme.badge} ${className}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full bg-white/90"
        aria-hidden="true"
      />
      {theme.label}
    </span>
  );
}
