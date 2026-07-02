import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ProfilePicture } from "@/components/ProfilePicture";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { useSelectedListStore } from "@/store/selectedListStore";
import { getPlatformTheme } from "@/theme/platformThemes";
import { getDraggableId } from "@/utils/selectedProfileId";
import { formatFollowersLabel } from "@/utils/formatters";

interface SelectedListPanelProps {
  embedded?: boolean;
}

export function SelectedListPanel({ embedded = false }: SelectedListPanelProps) {
  const profiles = useSelectedListStore((state) => state.profiles);
  const removeProfile = useSelectedListStore((state) => state.removeProfile);
  const reorderProfiles = useSelectedListStore((state) => state.reorderProfiles);
  const clearList = useSelectedListStore((state) => state.clearList);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderProfiles(result.source.index, result.destination.index);
  };

  return (
    <section
      aria-label="Campaign roster"
      className={
        embedded ? "" : "glass-card overflow-hidden rounded-2xl p-4"
      }
    >
      {!embedded && (
        <div className="mb-3 flex items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h2 className="font-display text-sm font-bold text-white">
              Campaign Roster
            </h2>
            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-white/35">
              {profiles.length === 0
                ? "Drag to reorder when populated"
                : `${profiles.length} creator${profiles.length === 1 ? "" : "s"}`}
            </p>
          </div>
          {profiles.length > 0 && (
            <button
              type="button"
              onClick={clearList}
              className="text-[10px] uppercase tracking-wider text-white/35 transition-colors hover:text-red-400"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {embedded && profiles.length > 0 && (
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={clearList}
            className="text-[10px] uppercase tracking-wider text-white/35 transition-colors hover:text-red-400"
          >
            Clear all
          </button>
        </div>
      )}

      {profiles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-8 text-center">
          <p className="mb-2 text-2xl opacity-40" aria-hidden="true">
            ★
          </p>
          <p className="text-sm leading-relaxed text-white/40">
            Add creators to build your campaign roster
          </p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="selected-list">
            {(provided) => (
              <ul
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2 overflow-y-visible pr-1"
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
                            ...(snapshot.isDragging ? { zIndex: 9999 } : {}),
                          }}
                          className={`relative flex items-center gap-2 overflow-hidden rounded-2xl border p-2 select-none touch-none ${
                            snapshot.isDragging
                              ? "glass-card cursor-grabbing border-pink-400/35"
                              : "cursor-grab border-white/15 bg-white/[0.06] hover:border-white/25 hover:bg-white/[0.09]"
                          }`}
                        >
                          <div
                            className="absolute inset-x-0 top-0 h-1"
                            style={{ background: theme.gradient }}
                            aria-hidden="true"
                          />
                          <span
                            className="shrink-0 pt-1 text-sm text-white/25"
                            aria-hidden="true"
                          >
                            ⠿
                          </span>
                          <ProfilePicture
                            username={item.profile.username}
                            src={item.profile.picture}
                            platform={item.platform}
                            handle={item.profile.handle}
                            alt=""
                            className="h-9 w-9 shrink-0 rounded-xl object-cover ring-1 ring-white/20 pointer-events-none"
                          />
                          <div className="min-w-0 flex-1 text-left">
                            <Link
                              to={`/profile/${item.profile.username}?platform=${item.platform}`}
                              className="block truncate text-sm font-medium text-white hover:text-pink-300 transition-colors"
                              onPointerDown={(event) =>
                                event.stopPropagation()
                              }
                            >
                              @{item.profile.username}
                              <VerifiedBadge
                                verified={item.profile.is_verified}
                              />
                            </Link>
                            <p className="truncate text-[11px] text-white/35 pointer-events-none">
                              {formatFollowersLabel(
                                item.profile.followers,
                                item.platform
                              )}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProfile(item.id)}
                            onPointerDown={(event) =>
                              event.stopPropagation()
                            }
                            aria-label={`Remove ${item.profile.username}`}
                            className="glass-bubble flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/45 transition-colors hover:text-red-400"
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
      )}
    </section>
  );
}
