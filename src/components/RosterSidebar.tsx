import { useSelectedListStore } from "@/store/selectedListStore";
import { RosterPanel } from "@/components/RosterPanel";
import { CloseIcon, StarIcon } from "@/components/RosterIcons";

interface RosterSidebarProps {
  className?: string;
  titleId?: string;
  onClose?: () => void;
}

export function RosterSidebar({
  className = "",
  titleId,
  onClose,
}: RosterSidebarProps) {
  const profiles = useSelectedListStore((state) => state.profiles);
  const clearList = useSelectedListStore((state) => state.clearList);

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
          <button
            type="button"
            onClick={clearList}
            className="mt-2 pl-5 text-[10px] uppercase tracking-wider text-white/35 transition-colors hover:text-red-400"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="roster-scroll min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-3">
        <RosterPanel className="w-full min-w-0" />
      </div>
    </aside>
  );
}
