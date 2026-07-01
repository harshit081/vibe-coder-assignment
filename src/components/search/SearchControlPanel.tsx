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
    <div className="flex w-[220px] flex-col items-stretch gap-2 sm:w-[240px]">
      <div className="glass-bubble flex items-center gap-2 rounded-full px-3.5 py-2">
        <span className="text-sm text-white/40" aria-hidden="true">
          ⌕
        </span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search"
          aria-label="Search creators"
          className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-end gap-1.5">
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
            pinned ? "text-pink-300 ring-1 ring-pink-400/40" : "text-white/55 hover:text-white"
          }`}
        >
          <PinIcon className="h-3.5 w-3.5" />
        </button>

        {!pinned && (
          <button
            type="button"
            onClick={onOpenRoster}
            title="Open roster"
            aria-label="Open roster"
            className="glass-bubble relative flex h-9 w-9 items-center justify-center rounded-full text-white/55 transition-colors hover:text-white"
          >
            <StarIcon className="h-3.5 w-3.5 text-pink-400/90" />
            {selectedCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[9px] font-bold text-white">
                {selectedCount}
              </span>
            )}
          </button>
        )}

      </div>

      {showPinnedRoster && (
        <div className="glass-panel-muted max-h-[min(42vh,320px)] overflow-hidden rounded-2xl border border-white/10">
          <RosterSidebar className="max-h-[min(42vh,320px)]" showPinToggle={false} />
        </div>
      )}
    </div>
  );
}
