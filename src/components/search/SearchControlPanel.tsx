import { PinIcon, StarIcon } from "@/components/RosterIcons";
import { RosterSidebar } from "@/components/RosterSidebar";
import { useRosterUiStore } from "@/store/rosterUiStore";
import { useSelectedListCount } from "@/store/selectedListStore";

interface SearchControlPanelProps {
  searchQuery: string;
  resultCount: number;
  totalCount: number;
  onSearchChange: (query: string) => void;
  onOpenRoster: () => void;
  showPinnedRoster: boolean;
}

export function SearchControlPanel({
  searchQuery,
  resultCount,
  totalCount,
  onSearchChange,
  onOpenRoster,
  showPinnedRoster,
}: SearchControlPanelProps) {
  const pinned = useRosterUiStore((state) => state.pinned);
  const togglePinned = useRosterUiStore((state) => state.togglePinned);
  const selectedCount = useSelectedListCount();

  return (
    <div className="flex w-full min-w-0 flex-col items-stretch gap-2 lg:w-[240px]">
      <div className="flex items-center gap-2">
        <div className="glass-bubble flex min-w-0 flex-1 items-center gap-2 rounded-full px-3 py-1.5 sm:px-3.5 sm:py-2">
          <span className="text-xs text-white/40 sm:text-sm" aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            aria-label="Search creators"
            className="min-w-0 flex-1 bg-transparent text-xs text-white placeholder:text-white/35 focus:outline-none sm:text-sm"
          />
          <span className="shrink-0 text-[9px] tabular-nums tracking-wide text-white/35 lg:hidden">
            {resultCount}/{totalCount}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenRoster}
          title={pinned ? "Expand roster" : "Open roster"}
          aria-label={pinned ? "Expand roster" : "Open roster"}
          className="glass-bubble relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-pink-400 transition-colors hover:text-pink-300 sm:h-10 sm:w-10 lg:hidden"
        >
          <StarIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          {selectedCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[9px] font-bold text-white">
              {selectedCount}
            </span>
          )}
        </button>
      </div>

      <div className="hidden items-center justify-end gap-1.5 lg:flex">
        <span className="mr-auto pl-1 text-[10px] tabular-nums tracking-wide text-white/35">
          {resultCount}/{totalCount}
        </span>

        <button
          type="button"
          onClick={togglePinned}
          title={pinned ? "Unpin roster" : "Pin roster"}
          aria-label={pinned ? "Unpin roster" : "Pin roster"}
          aria-pressed={pinned}
          className={`glass-bubble flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
            pinned ? "text-pink-300 ring-1 ring-pink-400/40" : "text-white/70 hover:text-white"
          }`}
        >
          <PinIcon className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onOpenRoster}
          title={pinned ? "Expand roster" : "Open roster"}
          aria-label={pinned ? "Expand roster" : "Open roster"}
          className="glass-bubble relative flex h-9 w-9 items-center justify-center rounded-full text-pink-400 transition-colors hover:text-pink-300"
        >
          <StarIcon className="h-3.5 w-3.5" />
          {selectedCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[9px] font-bold text-white">
              {selectedCount}
            </span>
          )}
        </button>

      </div>

      {showPinnedRoster && (
        <div className="glass-card hidden h-[min(320px,calc(100svh-11rem))] min-h-[140px] min-w-0 flex-col overflow-hidden rounded-2xl lg:flex">
          <RosterSidebar className="min-h-0 flex-1" compact />
        </div>
      )}
    </div>
  );
}
