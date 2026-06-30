import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import { GripIcon } from "@/components/RosterIcons";
import { ProfilePicture } from "@/components/ProfilePicture";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { useSelectedListStore } from "@/store/selectedListStore";
import { getPlatformTheme } from "@/theme/platformThemes";
import { getDraggableId } from "@/utils/selectedProfileId";
import { formatFollowers } from "@/utils/formatters";

interface RosterPanelProps {
  className?: string;
}

export function RosterPanel({ className = "" }: RosterPanelProps) {
  const profiles = useSelectedListStore((state) => state.profiles);
  const removeProfile = useSelectedListStore((state) => state.removeProfile);
  const reorderProfiles = useSelectedListStore((state) => state.reorderProfiles);

  const handleDragStart = () => {
    document.body.style.overflowX = "hidden";
  };

  const handleDragEnd = (result: DropResult) => {
    document.body.style.overflowX = "";
    if (!result.destination) return;
    reorderProfiles(result.source.index, result.destination.index);
  };

  if (profiles.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center text-center py-14 px-6 rounded-2xl border border-dashed border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent ${className}`}
      >
        <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4">
          <span className="text-pink-400/80 text-lg" aria-hidden="true">
            ★
          </span>
        </div>
        <p className="text-sm font-semibold text-zinc-300">No creators yet</p>
        <p className="text-xs text-zinc-500 mt-1.5 max-w-[240px] leading-relaxed">
          Use &quot;Add to roster&quot; on any profile to build your shortlist
        </p>
      </div>
    );
  }

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Droppable droppableId="roster-list">
        {(provided) => (
          <ul
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-2.5 ${className}`}
          >
            {profiles.map((item, index) => {
              const theme = getPlatformTheme(item.platform);

              return (
                <Draggable
                  key={item.id}
                  draggableId={getDraggableId(item.id)}
                  index={index}
                >
                  {(draggableProvided, snapshot) => (
                    <li
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      style={{
                        ...draggableProvided.draggableProps.style,
                        ...(snapshot.isDragging
                          ? { zIndex: 9999, opacity: 1 }
                          : undefined),
                      }}
                      className={`group relative flex items-stretch rounded-xl border select-none touch-none ${
                        snapshot.isDragging
                          ? "border-pink-500/50 bg-zinc-900 shadow-xl shadow-pink-500/15 cursor-grabbing overflow-visible"
                          : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/15 cursor-grab overflow-hidden transition-[background-color,border-color,box-shadow]"
                      }`}
                    >
                      <div
                        className="w-1 shrink-0"
                        style={{ background: theme.gradient }}
                        aria-hidden="true"
                      />

                      <div
                        className="flex items-center px-2 text-zinc-600 group-hover:text-zinc-400 shrink-0 pointer-events-none"
                        aria-hidden="true"
                      >
                        <GripIcon className="w-3.5 h-3.5" />
                      </div>

                      <span className="flex items-center w-5 shrink-0 text-[11px] font-bold text-zinc-600 tabular-nums pointer-events-none">
                        {index + 1}
                      </span>

                      <ProfilePicture
                        key={`${item.id}-${item.profile.picture}`}
                        username={item.profile.username}
                        src={item.profile.picture}
                        platform={item.platform}
                        handle={item.profile.handle}
                        alt={item.profile.fullname}
                        className="w-11 h-11 rounded-lg object-cover shrink-0 self-center ring-1 ring-white/10 pointer-events-none"
                      />

                      <div className="flex-1 min-w-0 py-3 pl-3 pr-2 text-left">
                        <Link
                          to={`/profile/${item.profile.username}?platform=${item.platform}`}
                          onPointerDown={(e) => e.stopPropagation()}
                          className="text-sm font-semibold text-white truncate block leading-tight hover:text-pink-300 transition-colors"
                        >
                          {item.profile.fullname}
                        </Link>
                        <p className="text-xs text-zinc-500 truncate mt-0.5">
                          @{item.profile.username}
                          <VerifiedBadge verified={item.profile.is_verified} />
                        </p>
                        <p className="text-[11px] text-zinc-600 mt-1 tabular-nums">
                          {formatFollowers(item.profile.followers)} ·{" "}
                          <span className="capitalize">{item.platform}</span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeProfile(item.id)}
                        onPointerDown={(e) => e.stopPropagation()}
                        aria-label={`Remove ${item.profile.username}`}
                        className="shrink-0 self-center mr-2 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-lg leading-none"
                      >
                        ×
                      </button>
                    </li>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}
