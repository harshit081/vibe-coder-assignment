import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
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
        embedded
          ? ""
          : "rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5"
      }
    >
      {!embedded && (
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="font-display font-bold text-white text-lg">
              Your Roster
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {profiles.length === 0
                ? "Drag to reorder when populated"
                : `${profiles.length} creator${profiles.length === 1 ? "" : "s"}`}
            </p>
          </div>
          {profiles.length > 0 && (
            <button
              type="button"
              onClick={clearList}
              className="text-xs text-red-400/80 hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {embedded && profiles.length > 0 && (
        <div className="flex justify-end mb-3">
          <button
            type="button"
            onClick={clearList}
            className="text-xs text-red-400/80 hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {profiles.length === 0 ? (
        <div className="py-8 text-center rounded-xl border border-dashed border-white/10">
          <p className="text-4xl mb-2 opacity-30" aria-hidden="true">
            ★
          </p>
          <p className="text-sm text-zinc-500 leading-relaxed px-2">
            Add creators to build your dream campaign roster
          </p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="selected-list">
            {(provided) => (
              <ul
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2 max-h-none overflow-y-visible pr-1"
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
                            ...(snapshot.isDragging ? { zIndex: 9999 } : {}),
                          }}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border select-none touch-none transition-shadow ${
                            snapshot.isDragging
                              ? "shadow-2xl border-white/20 bg-zinc-800 cursor-grabbing"
                              : "border-white/5 bg-white/[0.04] hover:bg-white/[0.07] cursor-grab"
                          }`}
                        >
                          <span
                            className="text-zinc-600 shrink-0 text-sm"
                            aria-hidden="true"
                          >
                            ⠿
                          </span>
                          <div
                            className="w-1 h-8 rounded-full shrink-0"
                            style={{ background: theme.gradient }}
                            aria-hidden="true"
                          />
                          <img
                            src={item.profile.picture}
                            alt=""
                            draggable={false}
                            className="w-9 h-9 rounded-lg object-cover shrink-0 pointer-events-none ring-1 ring-white/10"
                          />
                          <div className="flex-1 min-w-0 text-left">
                            <Link
                              to={`/profile/${item.profile.username}?platform=${item.platform}`}
                              className="block text-sm font-medium text-white truncate hover:text-pink-300 transition-colors"
                              onPointerDown={(event) =>
                                event.stopPropagation()
                              }
                            >
                              @{item.profile.username}
                              <VerifiedBadge
                                verified={item.profile.is_verified}
                              />
                            </Link>
                            <p className="text-[11px] text-zinc-500 truncate pointer-events-none">
                              {formatFollowersLabel(item.profile.followers)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProfile(item.id)}
                            onPointerDown={(event) =>
                              event.stopPropagation()
                            }
                            aria-label={`Remove ${item.profile.username}`}
                            className="text-zinc-600 hover:text-red-400 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/10 transition-colors shrink-0"
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
      )}
    </section>
  );
}
