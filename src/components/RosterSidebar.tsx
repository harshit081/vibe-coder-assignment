import { useState } from "react";
import { useSelectedListStore } from "@/store/selectedListStore";
import { useRosterUiStore } from "@/store/rosterUiStore";
import { RosterDownloadDialog } from "@/components/RosterDownloadDialog";
import { RosterPanel } from "@/components/RosterPanel";
import { CloseIcon, ChevronDownIcon, StarIcon } from "@/components/RosterIcons";
import {
  ROSTER_SORT_LABELS,
  type RosterSortBy,
} from "@/utils/rosterSort";
interface RosterSidebarProps {
  className?: string;
  titleId?: string;
  onClose?: () => void;
  compact?: boolean;
}

export function RosterSidebar({
  className = "",
  titleId,
  onClose,
  compact = false,
}: RosterSidebarProps) {
  const profiles = useSelectedListStore((state) => state.profiles);
  const clearList = useSelectedListStore((state) => state.clearList);
  const sortProfiles = useSelectedListStore((state) => state.sortProfiles);
  const sortBy = useRosterUiStore((state) => state.sortBy);
  const setSortBy = useRosterUiStore((state) => state.setSortBy);
  const [downloadOpen, setDownloadOpen] = useState(false);

  const handleSortChange = (value: RosterSortBy) => {
    setSortBy(value);
    if (value !== "custom") {
      sortProfiles(value);
    }
  };
  return (
    <aside
      className={`flex h-full min-w-0 flex-col overflow-x-hidden ${className}`}
      aria-label="Campaign roster"
    >
      <div className="shrink-0 border-b border-white/10 px-4 py-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <StarIcon className="h-3.5 w-3.5 shrink-0 text-pink-400/90" />
            <h2
              id={titleId}
              className="font-display truncate text-sm font-bold text-white"
            >
              Campaign Roster
            </h2>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                profiles.length > 0
                  ? "bg-pink-500/20 text-pink-300 ring-1 ring-pink-400/25"
                  : "bg-white/5 text-white/35"
              }`}
            >
              {profiles.length}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1">

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close roster"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        </div>


        {profiles.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 pl-1 text-[10px] uppercase tracking-wider">
            {!compact && (
              <div className="relative flex min-w-[9.5rem] flex-1 items-center gap-1.5">
                <span className="shrink-0 text-white/30">Sort</span>
                <select
                  value={sortBy}
                  onChange={(event) =>
                    handleSortChange(event.target.value as RosterSortBy)
                  }
                  aria-label="Sort roster"
                  className="glass-select min-w-0 flex-1 cursor-pointer py-0.5 pr-4 text-[10px] font-normal uppercase tracking-wider transition-colors"
                >
                  {(Object.keys(ROSTER_SORT_LABELS) as RosterSortBy[]).map(
                    (option) => (
                      <option key={option} value={option}>
                        {ROSTER_SORT_LABELS[option]}
                      </option>
                    )
                  )}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-white/25" />
              </div>
            )}

            <button
              type="button"
              onClick={() => setDownloadOpen(true)}
              className="text-white/35 transition-colors hover:text-pink-300"
            >
              Download
            </button>
            <button
              type="button"
              onClick={clearList}
              className="text-white/35 transition-colors hover:text-red-400"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden px-3 py-3">
        <RosterPanel className="w-full min-w-0" compact={compact} />
      </div>

      <RosterDownloadDialog
        open={downloadOpen}
        profiles={profiles}
        onClose={() => setDownloadOpen(false)}
      />
    </aside>
  );
}
