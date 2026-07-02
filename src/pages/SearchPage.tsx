import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Platform } from "@/types";
import { ProfileCardDeck } from "@/components/deck/ProfileCardDeck";
import { VideoBackground } from "@/components/layout/VideoBackground";
import { PlatformBubbleFilter } from "@/components/PlatformBubbleFilter";
import { RosterDrawer } from "@/components/RosterDrawer";
import { SearchControlPanel } from "@/components/search/SearchControlPanel";
import {
  extractProfiles,
  filterProfiles,
} from "@/utils/dataHelpers";
import { parsePlatformParam } from "@/utils/platformParams";
import { useRosterUiStore } from "@/store/rosterUiStore";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pinned = useRosterUiStore((state) => state.pinned);

  const platform = parsePlatformParam(searchParams.get("platform"));
  const searchQuery = searchParams.get("q") ?? "";

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

  return (
    <div className="relative h-svh overflow-hidden">
      <VideoBackground />

      <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-5 sm:px-4">
        <div className="pointer-events-auto">
          <PlatformBubbleFilter
            selected={platform}
            onChange={(p) => updateParams({ platform: p, q: "" })}
          />
        </div>
      </div>

      {!drawerOpen && (
        <>
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 lg:hidden">
            <div className="pointer-events-auto mx-auto max-w-lg">
              <SearchControlPanel
                searchQuery={searchQuery}
                resultCount={filtered.length}
                totalCount={allProfiles.length}
                onSearchChange={(q) => updateParams({ q })}
                onOpenRoster={() => setDrawerOpen(true)}
                showPinnedRoster={false}
              />
            </div>
          </div>

          <div className="pointer-events-none fixed bottom-3 right-3 top-[4.75rem] z-[60] hidden lg:block lg:bottom-auto lg:right-8 lg:top-1/2 lg:max-h-[calc(100svh-2.5rem)] lg:-translate-y-1/2">
            <div className="pointer-events-auto h-full max-h-full overflow-y-auto overflow-x-hidden overscroll-contain">
              <SearchControlPanel
                searchQuery={searchQuery}
                resultCount={filtered.length}
                totalCount={allProfiles.length}
                onSearchChange={(q) => updateParams({ q })}
                onOpenRoster={() => setDrawerOpen(true)}
                showPinnedRoster={pinned}
              />
            </div>
          </div>
        </>
      )}

      <section className="relative z-10 box-border h-full overflow-hidden pt-16 pb-[5.25rem] sm:pt-[4.5rem] lg:pb-0">
        <ProfileCardDeck
          key={platform}
          profiles={filtered}
          platform={platform}
        />
      </section>

      <RosterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
