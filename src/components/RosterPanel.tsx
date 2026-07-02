import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { GripIcon } from "@/components/RosterIcons";
import { ProfilePicture } from "@/components/ProfilePicture";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { useSelectedListStore } from "@/store/selectedListStore";
import { getPlatformTheme } from "@/theme/platformThemes";
import { getDraggableId } from "@/utils/selectedProfileId";
import { formatFollowers, getAudienceCountLabel } from "@/utils/formatters";

interface RosterPanelProps {
  className?: string;
  compact?: boolean;
}

export function RosterPanel({ className = "", compact = false }: RosterPanelProps) {
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
        className={`flex flex-col items-center justify-center rounded-2xl px-5 py-10 text-center ${className}`}
      >
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/15">
          <span className="text-base text-pink-400/90" aria-hidden="true">
            ★
          </span>
        </div>
        <p className="font-display text-sm font-semibold text-white/80">
          No creators yet
        </p>
        <p className="mt-1.5 max-w-[200px] text-xs leading-relaxed text-white/35">
          Tap + Add on any profile to build your shortlist
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
            className={`roster-scroll w-full min-w-0 max-h-full space-y-2 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 ${className}`}
          >
            {profiles.map((item, index) => {
              const theme = getPlatformTheme(item.platform);

              return (
                <Draggable
                  key={item.id}
                  draggableId={getDraggableId(item.id)}
                  index={index}
                >
                  {(draggableProvided, snapshot) => {
                    const row = (
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
                      className={`group relative flex w-full min-w-0 items-stretch overflow-hidden rounded-2xl border select-none touch-none ${
                        snapshot.isDragging
                          ? "cursor-grabbing border-pink-400/35 bg-white/10 shadow-lg shadow-pink-500/15"
                          : "cursor-grab border-white/15 bg-transparent transition-[border-color,background-color] hover:border-white/25 hover:bg-white/5"
                      }`}
                    >
                      <div
                        className="absolute inset-x-0 top-0 z-10 h-1"
                        style={{ background: theme.gradient }}
                        aria-hidden="true"
                      />

                      <div
                        className="flex shrink-0 items-center px-2 pt-2 text-white/25 group-hover:text-white/45 pointer-events-none"
                        aria-hidden="true"
                      >
                        <GripIcon className="h-3.5 w-3.5" />
                      </div>

                      <span className="flex w-4 shrink-0 items-center pt-2 text-[10px] font-bold tabular-nums text-white/30 pointer-events-none">
                        {index + 1}
                      </span>

                      <ProfilePicture
                        key={`${item.id}-${item.profile.picture}`}
                        username={item.profile.username}
                        src={item.profile.picture}
                        platform={item.platform}
                        handle={item.profile.handle}
                        alt={item.profile.fullname}
                        className="my-2.5 h-10 w-10 shrink-0 self-center rounded-xl object-cover ring-1 ring-white/20 pointer-events-none"
                      />

                      <div className="min-w-0 flex-1 py-2.5 pl-2 pr-1 text-left">
                        <Link
                          to={`/profile/${item.profile.username}?platform=${item.platform}`}
                          onPointerDown={(e) => e.stopPropagation()}
                          className="block truncate text-sm font-semibold leading-tight text-white transition-colors hover:text-pink-300"
                        >
                          {item.profile.fullname}
                        </Link>
                        <p className="mt-0.5 truncate text-xs text-white/45">
                          @{item.profile.username}
                          <VerifiedBadge verified={item.profile.is_verified} />
                        </p>
                        {!compact && (
                          <p className="mt-1 truncate text-[10px] tabular-nums text-white/30">
                            {formatFollowers(item.profile.followers)}{" "}
                            {getAudienceCountLabel(item.platform)} ·{" "}
                            <span className="capitalize">{item.platform}</span>
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeProfile(item.id)}
                        onPointerDown={(e) => e.stopPropagation()}
                        aria-label={`Remove ${item.profile.username}`}
                        className="mr-2 my-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-sm text-white/45 transition-colors hover:border-white/20 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </li>
                    );

                    return snapshot.isDragging
                      ? createPortal(row, document.body)
                      : row;
                  }}
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
