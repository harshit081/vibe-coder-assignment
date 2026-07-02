import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AddToListButton } from "@/components/AddToListButton";
import { PlatformBadge } from "@/components/PlatformBadge";
import { ProfilePicture } from "@/components/ProfilePicture";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, Platform, UserProfileSummary } from "@/types";
import { getPlatformTheme } from "@/theme/platformThemes";
import {
  formatEngagementRate,
  formatFollowers,
  getAudienceCountLabel,
} from "@/utils/formatters";
import {
  isDetailedProfile,
  loadProfileByUsername,
} from "@/utils/profileLoader";

interface ExpandedProfileShowcaseProps {
  summary: UserProfileSummary;
  platform: Platform;
  onClose: () => void;
}

function buildStats(user: FullUserProfile, platform: Platform) {
  const stats: { label: string; value: string; primary?: boolean }[] = [
    {
      label: getAudienceCountLabel(platform, true),
      value: formatFollowers(user.followers),
    },
    {
      label: "Engagement",
      value: formatEngagementRate(user.engagement_rate),
    },
  ];

  if (user.posts_count !== undefined) {
    stats.push({ label: "Posts", value: user.posts_count.toLocaleString() });
  }
  if (user.avg_likes !== undefined) {
    stats.push({ label: "Avg Likes", value: formatFollowers(user.avg_likes) });
  }
  if (user.avg_comments !== undefined) {
    stats.push({
      label: "Avg Comments",
      value: formatFollowers(user.avg_comments),
    });
  }
  if (user.avg_views !== undefined && user.avg_views > 0) {
    stats.push({ label: "Avg Views", value: formatFollowers(user.avg_views) });
  }
  if (user.engagements !== undefined) {
    stats.push({
      label: "Engagements",
      value: formatFollowers(user.engagements),
    });
  }

  return stats.map((stat, index) => ({
    ...stat,
    primary: index < 3,
  }));
}

export function ExpandedProfileShowcase({
  summary,
  platform,
  onClose,
}: ExpandedProfileShowcaseProps) {
  const [user, setUser] = useState<FullUserProfile>({ ...summary });
  const [ready, setReady] = useState(false);
  const theme = getPlatformTheme(platform);

  useEffect(() => {
    let cancelled = false;

    loadProfileByUsername(summary.username, platform).then((data) => {
      if (cancelled) return;
      setUser(data?.data.user_profile ?? { ...summary });
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [summary, platform]);

  const stats = buildStats(user, platform);
  const hasDetailed = isDetailedProfile(summary.username);

  return (
    <div
      className="showcase-panel relative flex max-h-[min(92svh,640px)] w-[min(calc(100vw-1.25rem),500px)] flex-col overflow-hidden overflow-y-auto rounded-2xl border border-white/15 bg-zinc-950 shadow-2xl sm:max-h-[min(78vh,580px)] sm:w-[min(calc(100vw-2rem),600px)]"
      style={{
        boxShadow: `0 40px 120px rgba(0,0,0,0.75), 0 0 60px ${theme.glow}`,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 z-10 h-1.5"
        style={{ background: theme.gradient }}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-3 top-3 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-lg text-white transition-colors hover:bg-black/90 sm:right-4 sm:top-4 sm:h-10 sm:w-10 sm:text-xl"
      >
        ×
      </button>

      <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
        <div className="relative h-40 shrink-0 sm:h-auto sm:w-[210px] md:w-[230px]">
          <ProfilePicture
            username={user.username}
            src={user.picture}
            platform={platform}
            handle={user.handle}
            alt={user.fullname}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-zinc-950/90" />
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center overflow-hidden border-t border-white/10 sm:border-t-0 sm:border-l sm:border-white/10">
          <div className="showcase-body flex w-full flex-col gap-2.5 p-3.5 sm:gap-4 sm:p-6">
            <header className="space-y-1 pr-7 sm:space-y-2 sm:pr-10">
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <PlatformBadge platform={platform} />
                {!ready && (
                  <span className="text-[10px] uppercase tracking-wider text-white/40 sm:text-[11px]">
                    Loading stats…
                  </span>
                )}
              </div>
              <h2 className="font-display text-base font-bold leading-tight text-white sm:text-[1.65rem]">
                {user.fullname}
              </h2>
              <p className="text-xs text-zinc-300 sm:text-base">
                @{user.username}
                <VerifiedBadge verified={user.is_verified} />
              </p>
              {user.description && (
                <p className="line-clamp-2 text-[10px] leading-snug text-zinc-400 sm:line-clamp-3 sm:text-sm">
                  {user.description}
                </p>
              )}
              {(user.gender || user.age_group) && (
                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-zinc-500 sm:gap-2 sm:text-xs">
                  {user.gender && (
                    <span className="rounded-full border border-white/10 px-2 py-0.5 sm:px-2.5 sm:py-1">
                      {user.gender}
                    </span>
                  )}
                  {user.age_group && (
                    <span className="rounded-full border border-white/10 px-2 py-0.5 sm:px-2.5 sm:py-1">
                      {user.age_group}
                    </span>
                  )}
                </div>
              )}
            </header>

            {ready && !hasDetailed && (
              <p className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs text-amber-200/90 sm:px-4 sm:py-2.5 sm:text-sm">
                Limited stats — extended analytics unavailable for this creator.
              </p>
            )}

            <section className="min-w-0">
              <h3 className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45 sm:text-sm">
                Performance
              </h3>
              <div className="mt-2 grid grid-cols-3 gap-1.5 sm:mt-3 sm:gap-2.5">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="min-w-0 rounded-lg border border-white/10 bg-white/[0.06] px-1.5 py-1.5 sm:rounded-xl sm:px-3 sm:py-2.5"
                    style={
                      stat.primary
                        ? {
                            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 20px -12px ${theme.primary}`,
                          }
                        : undefined
                    }
                  >
                    <p className="truncate text-[7px] font-medium uppercase tracking-wide text-white/45 sm:text-[11px]">
                      {stat.label}
                    </p>
                    <p
                      className={`mt-0.5 truncate font-bold tabular-nums text-white ${
                        stat.primary ? "text-xs sm:text-xl" : "text-[11px] sm:text-base"
                      }`}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <footer className="flex flex-wrap gap-1.5 border-t border-white/10 pt-2.5 sm:gap-2 sm:pt-4">
              <AddToListButton profile={user} platform={platform} size="sm" />
              <Link
                to={`/profile/${user.username}?platform=${platform}`}
                className="inline-flex items-center rounded-full border border-white/20 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-white/10 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                View more →
              </Link>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
