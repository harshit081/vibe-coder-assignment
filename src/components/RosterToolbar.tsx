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
        className="glass-bubble relative flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-pink-400 transition-colors hover:text-pink-300"
      >
        <StarIcon className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Roster</span>
        {selectedCount > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[9px] font-bold text-white tabular-nums">
            {selectedCount}
          </span>
        )}
      </button>
    </div>
  );
}
