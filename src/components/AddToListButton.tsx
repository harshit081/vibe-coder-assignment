import type { MouseEvent } from "react";
import type { Platform, UserProfileSummary } from "@/types";
import { useSelectedListStore } from "@/store/selectedListStore";

interface AddToListButtonProps {
  profile: UserProfileSummary;
  platform: Platform;
  className?: string;
  size?: "sm" | "md";
}

const sizeClasses = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-sm",
};

export function AddToListButton({
  profile,
  platform,
  className = "",
  size = "sm",
}: AddToListButtonProps) {
  const addProfile = useSelectedListStore((state) => state.addProfile);
  const isSelected = useSelectedListStore((state) =>
    state.isSelected(platform, profile.username)
  );

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!isSelected) {
      addProfile(profile, platform);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSelected}
      aria-label={
        isSelected
          ? `${profile.username} is already in your list`
          : `Add ${profile.username} to list`
      }
      className={`rounded font-medium transition-colors ${sizeClasses[size]} ${
        isSelected
          ? "bg-green-100 text-green-800 cursor-default"
          : "bg-gray-900 text-white hover:bg-gray-700 cursor-pointer"
      } ${className}`}
    >
      {isSelected ? "Added" : "Add to List"}
    </button>
  );
}
