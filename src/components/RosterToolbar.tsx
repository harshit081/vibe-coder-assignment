import { PinIcon, StarIcon } from "@/components/RosterIcons";
import { useRosterUiStore } from "@/store/rosterUiStore";
import { useSelectedListCount } from "@/store/selectedListStore";

interface RosterToolbarProps {
  onOpenDrawer: () => void;
  className?: string;
}

export function RosterToolbar({ onOpenDrawer, className = "" }: RosterToolbarProps) {
  const pinned = useRosterUiStore((state) => state.pinned);
  const togglePinned = useRosterUiStore((state) => state.togglePinned);
  const selectedCount = useSelectedListCount();

  return (
    <div className={`flex items-center gap-2 shrink-0 ${className}`}>
      <button
        type="button"
        onClick={togglePinned}
        title={pinned ? "Unpin roster" : "Pin roster permanently"}
        aria-label={pinned ? "Unpin roster" : "Pin roster permanently"}
        aria-pressed={pinned}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors border ${
          pinned
            ? "bg-pink-500/15 border-pink-500/30 text-pink-300"
            : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
        }`}
      >
        <PinIcon className="w-4 h-4" />
        <span className="hidden sm:inline">{pinned ? "Pinned" : "Pin roster"}</span>
      </button>

      {!pinned && (
        <button
          type="button"
          onClick={onOpenDrawer}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors border bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white"
        >
          <StarIcon className="w-3.5 h-3.5 text-pink-400" />
          <span className="hidden sm:inline">Roster</span>
          {selectedCount > 0 && (
            <span className="min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center rounded-md bg-pink-500 text-[11px] font-bold text-white tabular-nums">
              {selectedCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
