import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { useSelectedListStore } from "@/store/selectedListStore";
import { getDraggableId } from "@/utils/selectedProfileId";
import { getPlatformLabel } from "@/utils/dataHelpers";
import { formatFollowersLabel } from "@/utils/formatters";

export function SelectedListPanel() {
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
      aria-label="Selected influencers list"
      className="border border-gray-300 rounded-lg p-4 bg-gray-50"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <h2 className="font-semibold text-gray-900">
          Selected List
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({profiles.length})
          </span>
        </h2>
        {profiles.length > 0 && (
          <button
            type="button"
            onClick={clearList}
            className="text-xs text-red-600 hover:text-red-800 underline"
          >
            Clear all
          </button>
        )}
      </div>

      {profiles.length === 0 ? (
        <p className="text-sm text-gray-500">
          No profiles selected yet. Use &quot;Add to List&quot; on any creator to
          build your shortlist.
        </p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="selected-list">
            {(provided) => (
              <ul
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2"
              >
                {profiles.map((item, index) => (
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
                        className={`flex items-center gap-2 p-2 bg-white border rounded select-none touch-none ${
                          snapshot.isDragging
                            ? "shadow-md border-gray-400"
                            : ""
                        } ${snapshot.isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                      >
                        <span
                          aria-hidden="true"
                          className="text-gray-400 px-1 shrink-0"
                        >
                          ⠿
                        </span>
                        <img
                          src={item.profile.picture}
                          alt=""
                          draggable={false}
                          className="w-9 h-9 rounded-full shrink-0 pointer-events-none"
                        />
                        <div className="flex-1 min-w-0 text-left">
                          <Link
                            to={`/profile/${item.profile.username}?platform=${item.platform}`}
                            className="block text-sm font-medium text-gray-900 truncate hover:underline"
                            onPointerDown={(event) => event.stopPropagation()}
                          >
                            @{item.profile.username}
                            <VerifiedBadge verified={item.profile.is_verified} />
                          </Link>
                          <p className="text-xs text-gray-500 truncate pointer-events-none">
                            {getPlatformLabel(item.platform)} ·{" "}
                            {formatFollowersLabel(item.profile.followers)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProfile(item.id)}
                          onPointerDown={(event) => event.stopPropagation()}
                          aria-label={`Remove ${item.profile.username} from list`}
                          className="text-gray-400 hover:text-red-600 px-1 text-lg leading-none shrink-0"
                        >
                          ×
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </section>
  );
}
