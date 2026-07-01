import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { AddToListButton } from "@/components/AddToListButton";
import { ProfilePicture } from "@/components/ProfilePicture";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { getPlatformTheme } from "@/theme/platformThemes";
import { formatFollowers, formatEngagementRate, getAudienceCountLabel } from "@/utils/formatters";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
}

export function ProfileCard({ profile, platform }: ProfileCardProps) {
  const navigate = useNavigate();
  const theme = getPlatformTheme(platform);

  const handleClick = () => {
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  return (
    <article
      onClick={handleClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#12121a] border border-white/[0.06] cursor-pointer transition-all duration-200 hover:border-white/15 hover:shadow-xl hover:shadow-black/40"
    >
      {/* Avatar hero */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 scale-110 blur-2xl transition-opacity duration-500 group-hover:opacity-0"
          style={{ background: theme.gradient }}
          aria-hidden="true"
        />
        <ProfilePicture
          key={`hero-${profile.username}-${profile.picture}`}
          username={profile.username}
          src={profile.picture}
          platform={platform}
          handle={profile.handle}
          alt={profile.fullname}
          className="absolute inset-0 w-full h-full object-cover opacity-40 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-[#12121a]/50 to-transparent transition-opacity duration-500 group-hover:opacity-0 pointer-events-none" />

        <div className="absolute bottom-3 left-3 right-3 flex items-end gap-3">
          <ProfilePicture
            key={`thumb-${profile.username}-${profile.picture}`}
            username={profile.username}
            src={profile.picture}
            platform={platform}
            handle={profile.handle}
            alt=""
            className="w-14 h-14 rounded-xl object-cover ring-2 ring-white/20 shrink-0 transition-opacity duration-300 group-hover:opacity-0"
          />
          <div className="flex-1 min-w-0 text-left pb-0.5">
            <p className="font-display font-bold text-white text-sm truncate leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {profile.fullname}
            </p>
            <p className="text-xs text-zinc-200 truncate drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              @{profile.username}
              <VerifiedBadge verified={profile.is_verified} />
            </p>
          </div>
        </div>

        {profile.is_verified && (
          <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-500/90 flex items-center justify-center text-[10px] text-white drop-shadow-lg">
            ✓
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="px-3 py-3 flex items-center justify-between gap-2 border-t border-white/[0.04]">
        <div className="text-left min-w-0">
          <p className="text-sm font-semibold text-white tabular-nums">
            {formatFollowers(profile.followers)}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-zinc-600">
            {getAudienceCountLabel(platform)}
          </p>
        </div>
        {profile.engagement_rate !== undefined && (
          <div className="text-right min-w-0">
            <p className="text-sm font-semibold text-white tabular-nums">
              {formatEngagementRate(profile.engagement_rate)}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-zinc-600">
              engagement
            </p>
          </div>
        )}
        <div onClick={(e) => e.stopPropagation()} className="shrink-0">
          <AddToListButton profile={profile} platform={platform} />
        </div>
      </div>
    </article>
  );
}
