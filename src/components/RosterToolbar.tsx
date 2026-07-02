import { StarIcon } from "@/components/RosterIcons";
import { useSelectedListCount } from "@/store/selectedListStore";

interface RosterToolbarProps {
  onOpenDrawer: () => void;
  className?: string;
}

export function RosterToolbar({
  onOpenDrawer,
  className = "",
}: RosterToolbarProps) {
  const selectedCount = useSelectedListCount();

  return (
    <div className={`flex shrink-0 items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={onOpenDrawer}
        className="glass-bubble relative flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-medium text-pink-400 transition-colors hover:text-pink-300 sm:h-9 sm:px-3 sm:text-xs"
      >
        <StarIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        <span className="hidden sm:inline">Roster</span>
        {selectedCount > 0 && (
          <span className="flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-pink-500 px-1 text-[8px] font-bold tabular-nums text-white sm:h-4 sm:min-w-4 sm:text-[9px]">
            {selectedCount}
          </span>
        )}
      </button>
    </div>
  );
}
