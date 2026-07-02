import { useState } from "react";
import { ProfilePicture } from "@/components/ProfilePicture";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { getPlatformTheme } from "@/theme/platformThemes";
import type { Platform, UserProfileSummary } from "@/types";
import {
  formatEngagementRate,
  formatFollowers,
  getAudienceCountLabel,
} from "@/utils/formatters";

interface CylinderProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
}

function BackStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/35 px-2 py-1.5 text-center backdrop-blur-sm sm:rounded-xl sm:px-2.5 sm:py-2">
      <p className="text-[8px] uppercase tracking-wider text-zinc-400 sm:text-[9px]">{label}</p>
      <p className="mt-0.5 text-xs font-semibold tabular-nums text-white sm:text-sm">{value}</p>
    </div>
  );
}

export function CylinderProfileCard({
  profile,
  platform,
}: CylinderProfileCardProps) {
  const theme = getPlatformTheme(platform);
  const [flipped, setFlipped] = useState(false);

  const backStats: { label: string; value: string }[] = [
    {
      label: "Engagement",
      value: formatEngagementRate(profile.engagement_rate),
    },
  ];

  if (profile.engagements !== undefined) {
    backStats.push({
      label: "Engagements",
      value: formatFollowers(profile.engagements),
    });
  }
  if (profile.avg_views !== undefined && profile.avg_views > 0) {
    backStats.push({
      label: "Avg views",
      value: formatFollowers(profile.avg_views),
    });
  }

  backStats.push({
    label: getAudienceCountLabel(platform, true),
    value: formatFollowers(profile.followers),
  });

  return (
    <div
      className="deck-card-root absolute inset-0"
      data-deck-card
      data-user-id={profile.user_id}
      onPointerEnter={() => setFlipped(true)}
      onPointerLeave={() => setFlipped(false)}
    >
      <div
        className={`deck-card-flip-inner ${flipped ? "is-flipped" : ""}`}
        style={{ width: "100%", height: "100%" }}
      >
        <div className="deck-card-face deck-card-face-front">
          <div className="deck-card-surface">
            <div
              role="button"
              tabIndex={0}
              data-deck-card
              data-user-id={profile.user_id}
              className="relative h-full w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <div
                className="absolute inset-x-0 top-0 z-10 h-1.5"
                style={{ background: theme.gradient }}
                aria-hidden="true"
              />

              <div className="relative h-[62%] overflow-hidden">
                <ProfilePicture
                  username={profile.username}
                  src={profile.picture}
                  platform={platform}
                  handle={profile.handle}
                  alt={profile.fullname}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                {profile.is_verified && (
                  <span className="absolute left-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/90 text-[9px] text-white sm:left-3 sm:top-3 sm:h-6 sm:w-6 sm:text-[10px]">
                    ✓
                  </span>
                )}
              </div>

              <div className="relative flex h-[38%] flex-col justify-between p-3 pt-2.5 sm:p-4 sm:pt-3">
                <div>
                  <p className="font-display text-[13px] font-bold leading-tight text-white sm:text-lg">
                    {profile.fullname}
                  </p>
                  <p className="mt-0.5 text-[10px] text-zinc-300 sm:mt-1 sm:text-sm">
                    @{profile.username}
                    <VerifiedBadge verified={profile.is_verified} />
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold tabular-nums text-white sm:text-lg">
                    {formatFollowers(profile.followers)}
                  </p>
                  <p className="mt-0.5 text-[8px] uppercase tracking-wider text-zinc-500 sm:text-[10px]">
                    {getAudienceCountLabel(platform)}
                  </p>
                </div>
              </div>


              <button
                type="button"
                data-deck-expand
                aria-label="Expand profile"
                title="Expand profile"
                className="glass-bubble absolute bottom-2.5 right-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/90 transition-colors hover:bg-white/15 hover:text-white sm:bottom-3 sm:right-3 sm:h-9 sm:w-9"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17L17 7M17 7H9M17 7V15" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="deck-card-face deck-card-face-back">
          <div
            className="deck-card-surface"
            data-deck-card
            data-user-id={profile.user_id}
          >
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <ProfilePicture
                username={profile.username}
                src={profile.picture}
                platform={platform}
                handle={profile.handle}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-lg"
              />
              <div className="absolute inset-0 bg-zinc-950/82" />
            </div>

            <div
              className="absolute inset-x-0 top-0 z-10 h-1.5"
              style={{ background: theme.gradient }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex h-full flex-col p-3 pt-3 sm:p-4 sm:pt-4">
              <div className="mb-2.5 flex shrink-0 items-center gap-2.5 sm:mb-3 sm:gap-3">
                <ProfilePicture
                  username={profile.username}
                  src={profile.picture}
                  platform={platform}
                  handle={profile.handle}
                  alt={profile.fullname}
                  className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-white/25 sm:h-14 sm:w-14"
                />
                <div className="min-w-0 text-left">
                  <p className="truncate font-display text-xs font-bold text-white sm:text-sm">
                    {profile.fullname}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-zinc-300 sm:text-xs">
                    @{profile.username}
                    <VerifiedBadge verified={profile.is_verified} />
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 sm:gap-2">
                {backStats.map((stat) => (
                  <BackStat key={stat.label} label={stat.label} value={stat.value} />
                ))}
              </div>

              <p className="mt-auto pt-2 text-center text-[8px] uppercase tracking-[0.14em] text-white/35 sm:pt-3 sm:text-[9px]">
                {platform}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
