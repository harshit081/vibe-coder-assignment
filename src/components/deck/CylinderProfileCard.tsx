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
    <div className="rounded-xl border border-white/10 bg-black/35 px-2.5 py-2 text-center backdrop-blur-sm">
      <p className="text-[9px] uppercase tracking-wider text-zinc-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums text-white">{value}</p>
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
                  <span className="absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/90 text-[10px] text-white">
                    ✓
                  </span>
                )}
              </div>

              <div className="relative flex h-[38%] flex-col justify-between p-4 pt-3">
                <div>
                  <p className="font-display text-base font-bold leading-tight text-white sm:text-lg">
                    {profile.fullname}
                  </p>
                  <p className="mt-1 text-xs text-zinc-300 sm:text-sm">
                    @{profile.username}
                    <VerifiedBadge verified={profile.is_verified} />
                  </p>
                </div>
                <div>
                  <p className="text-lg font-semibold tabular-nums text-white">
                    {formatFollowers(profile.followers)}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-zinc-500">
                    {getAudienceCountLabel(platform)}
                  </p>
                </div>
              </div>


              <button
                type="button"
                data-deck-expand
                aria-label="Expand profile"
                title="Expand profile"
                className="absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full glass-bubble border border-white/20 text-white/90 transition-colors hover:bg-white/15 hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
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

            <div className="relative z-10 flex h-full flex-col p-4 pt-4">
              <div className="mb-3 flex shrink-0 items-center gap-3">
                <ProfilePicture
                  username={profile.username}
                  src={profile.picture}
                  platform={platform}
                  handle={profile.handle}
                  alt={profile.fullname}
                  className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-white/25"
                />
                <div className="min-w-0 text-left">
                  <p className="truncate font-display text-sm font-bold text-white">
                    {profile.fullname}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-zinc-300">
                    @{profile.username}
                    <VerifiedBadge verified={profile.is_verified} />
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {backStats.map((stat) => (
                  <BackStat key={stat.label} label={stat.label} value={stat.value} />
                ))}
              </div>

              <p className="mt-auto pt-3 text-center text-[9px] uppercase tracking-[0.14em] text-white/35">
                {platform}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
