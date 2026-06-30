import { useSelectedListStore } from "@/store/selectedListStore";

import { useRosterUiStore } from "@/store/rosterUiStore";

import { RosterPanel } from "@/components/RosterPanel";

import { CloseIcon, PinIcon } from "@/components/RosterIcons";



interface RosterSidebarProps {

  className?: string;

  onClose?: () => void;

  showPinToggle?: boolean;

}



export function RosterSidebar({

  className = "",

  onClose,

  showPinToggle = true,

}: RosterSidebarProps) {

  const profiles = useSelectedListStore((state) => state.profiles);

  const clearList = useSelectedListStore((state) => state.clearList);

  const pinned = useRosterUiStore((state) => state.pinned);

  const togglePinned = useRosterUiStore((state) => state.togglePinned);



  return (

    <aside

      className={`flex flex-col h-full overflow-x-hidden ${className}`}

      aria-label="Campaign roster"

    >

      <div className="shrink-0 px-5 pt-5 pb-4 border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent">

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <div className="flex items-center gap-2.5">

              <h2 className="font-display text-lg font-bold text-white truncate">

                Campaign Roster

              </h2>

              <span

                className={`px-2 py-0.5 rounded-md text-xs font-bold tabular-nums shrink-0 ${

                  profiles.length > 0

                    ? "bg-pink-500/20 text-pink-300"

                    : "bg-white/5 text-zinc-500"

                }`}

              >

                {profiles.length}

              </span>

            </div>

            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">

              {pinned

                ? "Pinned — always visible while you browse"

                : "Drag to reorder your shortlist"}

            </p>

          </div>



          <div className="flex items-center gap-1 shrink-0">

            {showPinToggle && (

              <button

                type="button"

                onClick={togglePinned}

                title={pinned ? "Unpin roster" : "Pin roster permanently"}

                aria-label={pinned ? "Unpin roster" : "Pin roster permanently"}

                aria-pressed={pinned}

                className={`flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium transition-colors ${

                  pinned

                    ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"

                    : "text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent"

                }`}

              >

                <PinIcon className="w-3.5 h-3.5" />

                <span className="hidden sm:inline">{pinned ? "Pinned" : "Pin"}</span>

              </button>

            )}

            {onClose && (

              <button

                type="button"

                onClick={onClose}

                aria-label="Close roster"

                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"

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

            className="mt-3 text-xs text-zinc-500 hover:text-red-400 transition-colors"

          >

            Clear all

          </button>

        )}

      </div>



      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 min-h-0 roster-scroll">

        <RosterPanel />

      </div>

    </aside>

  );

}


