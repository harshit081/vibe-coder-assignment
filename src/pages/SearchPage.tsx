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

      <div className="pointer-events-none fixed right-3 top-[4.75rem] z-40 sm:right-5 lg:right-8 lg:top-1/2 lg:-translate-y-1/2">
        <div className="pointer-events-auto">
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

      <section className="relative z-10 box-border h-full overflow-hidden pt-16 sm:pt-[4.5rem]">
        <ProfileCardDeck
          key={platform}
          profiles={filtered}
          platform={platform}
        />
      </section>

      <RosterDrawer
        open={drawerOpen && !pinned}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
