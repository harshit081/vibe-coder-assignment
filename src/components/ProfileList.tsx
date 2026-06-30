import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  searchQuery: string;
}

export function ProfileList({
  profiles,
  platform,
  searchQuery,
}: ProfileListProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
      {profiles.length === 0 && <p>No profiles found</p>}
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.user_id}
          profile={profile}
          platform={platform}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
}
