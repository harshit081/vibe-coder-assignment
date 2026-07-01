import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { getPlatformTheme } from "@/theme/platformThemes";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  resultCount: number;
  totalCount: number;
  variant?: "default" | "glass";
}

export function PlatformFilter({
  selected,
  onChange,
  resultCount,
  totalCount,
  variant = "default",
}: PlatformFilterProps) {
  const isGlass = variant === "glass";

  return (
    <div
      className={
        isGlass
          ? "flex flex-col gap-3"
          : "flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 pb-3"
      }
    >
      <div
        className={`flex gap-1 p-1 ${
          isGlass
            ? "glass-input rounded-2xl"
            : "rounded-xl bg-white/[0.04] border border-white/10"
        }`}
        role="tablist"
        aria-label="Social platform"
      >
        {PLATFORMS.map((p) => {
          const theme = getPlatformTheme(p);
          const isActive = selected === p;

          return (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(p)}
              className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "text-white shadow-md"
                  : "text-zinc-500 hover:text-zinc-200"
              }`}
              style={
                isActive
                  ? {
                      background: theme.gradient,
                      boxShadow: `0 4px 20px -6px ${theme.glow}`,
                    }
                  : undefined
              }
            >
              {getPlatformLabel(p)}
            </button>
          );
        })}
      </div>

      {!isGlass && (
        <p className="hidden md:block text-xs text-zinc-600 shrink-0">
          {resultCount} / {totalCount}
        </p>
      )}
    </div>
  );
}
