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
      className="showcase-panel relative flex h-[min(78vh,580px)] w-[min(calc(100vw-2rem),600px)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-zinc-950 shadow-2xl"
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
        className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-xl text-white transition-colors hover:bg-black/90"
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
          <div className="showcase-body flex w-full flex-col gap-4 p-5 sm:p-6">
            <header className="space-y-2 pr-10">
              <div className="flex flex-wrap items-center gap-2.5">
                <PlatformBadge platform={platform} />
                {!ready && (
                  <span className="text-[11px] uppercase tracking-wider text-white/40">
                    Loading stats…
                  </span>
                )}
              </div>
              <h2 className="font-display text-2xl font-bold leading-tight text-white sm:text-[1.65rem]">
                {user.fullname}
              </h2>
              <p className="text-base text-zinc-300">
                @{user.username}
                <VerifiedBadge verified={user.is_verified} />
              </p>
              {user.description && (
                <p className="line-clamp-3 text-sm leading-relaxed text-zinc-400">
                  {user.description}
                </p>
              )}
              {(user.gender || user.age_group) && (
                <div className="flex flex-wrap gap-2 pt-1 text-xs text-zinc-500">
                  {user.gender && (
                    <span className="rounded-full border border-white/10 px-2.5 py-1">
                      {user.gender}
                    </span>
                  )}
                  {user.age_group && (
                    <span className="rounded-full border border-white/10 px-2.5 py-1">
                      {user.age_group}
                    </span>
                  )}
                </div>
              )}
            </header>

            {ready && !hasDetailed && (
              <p className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-200/90">
                Limited stats — extended analytics unavailable for this creator.
              </p>
            )}

            <section>
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white/45">
                Performance
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5"
                    style={
                      stat.primary
                        ? {
                            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 24px -10px ${theme.primary}`,
                          }
                        : undefined
                    }
                  >
                    <p className="text-[11px] font-medium uppercase tracking-wider text-white/45">
                      {stat.label}
                    </p>
                    <p
                      className={`mt-1 font-bold tabular-nums text-white ${
                        stat.primary ? "text-xl" : "text-base"
                      }`}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <footer className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
              <AddToListButton profile={user} platform={platform} size="md" />
              <Link
                to={`/profile/${user.username}?platform=${platform}`}
                className="inline-flex items-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
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
