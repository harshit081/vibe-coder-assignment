import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { AddToListButton } from "@/components/AddToListButton";
import { formatFollowersLabel } from "@/utils/formatters";
import { VerifiedBadge } from "./VerifiedBadge";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
}

export function ProfileCard({
  profile,
  platform,
  searchQuery,
}: ProfileCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 p-3 border border-gray-300 mb-2 cursor-pointer hover:bg-gray-50 w-full"
      data-search={searchQuery}
    >
      <img
        src={profile.picture}
        alt={`${profile.fullname} profile`}
        className="w-12 h-12 rounded-full"
      />
      <div className="text-left flex-1">
        <div className="font-bold">
          @{profile.username}
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div className="text-sm text-gray-600">{profile.fullname}</div>
        <div className="text-sm">{formatFollowersLabel(profile.followers)}</div>
      </div>
      <AddToListButton profile={profile} platform={platform} />
    </div>
  );
}
