import type { Platform } from "@/types";

export function getSelectedProfileId(
  platform: Platform,
  username: string
): string {
  return `${platform}:${username.toLowerCase()}`;
}

/** DnD library-safe id (avoids special chars in draggableId) */
export function getDraggableId(selectedProfileId: string): string {
  return selectedProfileId.replace(/:/g, "__");
}
