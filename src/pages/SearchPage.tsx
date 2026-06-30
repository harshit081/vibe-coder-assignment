import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Platform } from "@/types";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { RosterDrawer } from "@/components/RosterDrawer";
import { RosterSidebar } from "@/components/RosterSidebar";
import { RosterToolbar } from "@/components/RosterToolbar";
import { getPlatformTheme } from "@/theme/platformThemes";
import {
  extractProfiles,
  filterProfiles,
  getPlatformLabel,
} from "@/utils/dataHelpers";
import {
  buildSearchUrl,
  parsePlatformParam,
} from "@/utils/platformParams";
import { useRosterUiStore } from "@/store/rosterUiStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pinned = useRosterUiStore((state) => state.pinned);
  const isDesktopRoster = useMediaQuery("(min-width: 1280px)");

  const platform = parsePlatformParam(searchParams.get("platform"));
  const searchQuery = searchParams.get("q") ?? "";
  const theme = getPlatformTheme(platform);

  const allProfiles = extractProfiles(platform);
  const filtered = filterProfiles(allProfiles, searchQuery);

  const updateParams = (updates: { platform?: Platform; q?: string }) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (updates.platform !== undefined) {
          next.set("platform", updates.platform);
        }
        if (updates.q !== undefined) {
          if (updates.q) {
            next.set("q", updates.q);
          } else {
            next.delete("q");
          }
        }
        return next;
      },
      { replace: true }
    );
  };

  const openRoster = () => setDrawerOpen(true);

  return (
    <div className="min-h-screen flex flex-col grid-bg">
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-72 opacity-25 blur-3xl"
        style={{ background: theme.gradient }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-1 min-h-0 overflow-x-hidden">
        {/* Main column */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="shrink-0 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
            <div className="flex items-center gap-4 px-4 sm:px-6 lg:px-8 h-16">
              <Link
                to={buildSearchUrl(platform, searchQuery)}
                className="font-display text-lg font-bold text-white shrink-0 hidden sm:block"
              >
                Influencer<span className="text-pink-500">Search</span>
              </Link>

              <div className="flex-1 min-w-0 max-w-2xl mx-auto w-full">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none">
                    ⌕
                  </span>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => updateParams({ q: e.target.value })}
                    placeholder="Search by name or @username"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/25 transition-colors"
                  />
                </div>
              </div>

              <RosterToolbar onOpenDrawer={openRoster} />
            </div>

            <PlatformFilter
              selected={platform}
              onChange={(p) => updateParams({ platform: p, q: "" })}
              resultCount={filtered.length}
              totalCount={allProfiles.length}
            />
          </header>

          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 overflow-y-auto">
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <h1 className="font-display text-xl sm:text-2xl font-bold text-white">
                Top {getPlatformLabel(platform)} creators
              </h1>
              <p className="text-xs text-zinc-500 shrink-0">
                {filtered.length} result{filtered.length === 1 ? "" : "s"}
              </p>
            </div>

            <ProfileList profiles={filtered} platform={platform} />

            {/* Pinned roster on mobile/tablet — below grid (single instance) */}
            {pinned && !isDesktopRoster && (
              <div className="mt-10 pt-8 border-t border-white/10">
                <RosterSidebar className="max-h-[480px] rounded-2xl border border-white/10 bg-[#0c0c13]/80 overflow-hidden" />
              </div>
            )}
          </main>
        </div>

        {/* Pinned roster — desktop sidebar (single instance) */}
        {pinned && isDesktopRoster && (
          <RosterSidebar className="w-[380px] shrink-0 border-l border-white/10 bg-[#0a0a0f] sticky top-0 h-screen overflow-x-hidden" />
        )}
      </div>

      <RosterDrawer
        open={drawerOpen && !pinned}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
