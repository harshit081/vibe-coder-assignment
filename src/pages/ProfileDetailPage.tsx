import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { AddToListButton } from "@/components/AddToListButton";
import { HeroPortrait } from "@/components/HeroPortrait";
import { PlatformBadge } from "@/components/PlatformBadge";
import { RosterDrawer } from "@/components/RosterDrawer";
import { RosterSidebar } from "@/components/RosterSidebar";
import { RosterToolbar } from "@/components/RosterToolbar";
import { useRosterUiStore } from "@/store/rosterUiStore";
import { StatCard } from "@/components/StatCard";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, Platform, ProfileDetailResponse } from "@/types";
import { getPlatformTheme } from "@/theme/platformThemes";
import {
  formatEngagementRate,
  formatFollowers,
} from "@/utils/formatters";
import { isDetailedProfile, loadProfileByUsername } from "@/utils/profileLoader";
import { buildSearchUrl, parsePlatformParamNullable } from "@/utils/platformParams";

const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

function resolvePlatform(
  queryPlatform: Platform | null,
  profileType?: string
): Platform | null {
  if (queryPlatform) return queryPlatform;
  if (profileType && PLATFORMS.includes(profileType as Platform)) {
    return profileType as Platform;
  }
  return null;
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const queryPlatform = parsePlatformParamNullable(searchParams.get("platform"));
  const rosterPinned = useRosterUiStore((state) => state.pinned);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(
    null
  );
  const [loadedUsername, setLoadedUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    let cancelled = false;

    loadProfileByUsername(username, queryPlatform).then((data) => {
      if (cancelled) return;
      setProfileData(data);
      setLoadedUsername(username);
    });

    return () => {
      cancelled = true;
    };
  }, [username, queryPlatform]);

  const isLoading = loadedUsername !== username;

  if (!username) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <Link
          to={buildSearchUrl(queryPlatform)}
          className="text-pink-400 hover:underline"
        >
          Back to discovery
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen grid-bg flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-pink-500/30 border-t-pink-500 animate-spin" />
        <p className="text-zinc-500">Loading showcase…</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen grid-bg flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-red-400">Could not load profile for @{username}</p>
        <Link
          to={buildSearchUrl(queryPlatform)}
          className="text-pink-400 hover:underline"
        >
          ← Back to discovery
        </Link>
      </div>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const platform = resolvePlatform(queryPlatform, user.type);
  const theme = platform ? getPlatformTheme(platform) : null;
  const backUrl = buildSearchUrl(platform ?? queryPlatform);
  const hasDetailedData = isDetailedProfile(username);

  const stats: { label: string; value: string; large?: boolean }[] = [
    { label: "Followers", value: formatFollowers(user.followers), large: true },
    {
      label: "Engagement",
      value: formatEngagementRate(user.engagement_rate),
      large: true,
    },
    ...(user.posts_count !== undefined
      ? [{ label: "Posts", value: user.posts_count.toLocaleString() }]
      : []),
    ...(user.avg_likes !== undefined
      ? [{ label: "Avg Likes", value: formatFollowers(user.avg_likes) }]
      : []),
    ...(user.avg_comments !== undefined
      ? [{ label: "Avg Comments", value: formatFollowers(user.avg_comments) }]
      : []),
    ...(user.avg_views !== undefined && user.avg_views > 0
      ? [{ label: "Avg Views", value: formatFollowers(user.avg_views) }]
      : []),
    ...(user.engagements !== undefined
      ? [{ label: "Engagements", value: formatFollowers(user.engagements) }]
      : []),
  ];

  return (
    <div className="min-h-screen">
      {/* Hero section — full bleed showoff */}
      <section
        className={`relative overflow-hidden ${
          theme ? `bg-gradient-to-br ${theme.mesh}` : "bg-zinc-950"
        }`}
      >
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 -translate-y-1/2 translate-x-1/4"
          style={{ background: theme?.primary ?? "#E1306C" }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-8">
          <header className="flex items-center justify-between gap-4 mb-6">
            <Link
              to={backUrl}
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              ← Discovery
            </Link>
            <div className="flex items-center gap-3">
              {platform && <PlatformBadge platform={platform} />}
              <RosterToolbar onOpenDrawer={() => setDrawerOpen(true)} />
            </div>
          </header>

          <div className="grid lg:grid-cols-2 gap-8 items-end">
            <div className="text-left animate-fade-up order-2 lg:order-1 pb-4">
              <p className="text-white/50 text-sm uppercase tracking-widest mb-2">
                Creator Showcase
              </p>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-2">
                {user.fullname}
              </h1>
              <p className="text-xl text-white/70 mb-4">
                @{user.username}
                <VerifiedBadge verified={user.is_verified} />
              </p>

              {user.description && (
                <p className="text-white/60 text-base max-w-lg leading-relaxed mb-6 line-clamp-3">
                  {user.description}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                {platform && (
                  <AddToListButton
                    profile={user}
                    platform={platform}
                    size="md"
                    variant="showoff"
                  />
                )}
                {user.url && (
                  <a
                    href={user.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors"
                  >
                    View on platform ↗
                  </a>
                )}
              </div>
            </div>

            <div className="order-1 lg:order-2 animate-fade-up-delay-1">
              <HeroPortrait
                username={user.username}
                fullname={user.fullname}
                fallbackSrc={user.picture}
                glowColor={theme?.glow ?? "rgba(255,255,255,0.2)"}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats + roster */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div
          className={`flex flex-col gap-8 ${rosterPinned ? "xl:flex-row" : ""}`}
        >
          <div className="flex-1 min-w-0">
            {!hasDetailedData && (
              <p className="text-amber-400/80 text-sm mb-6 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                Limited stats — extended analytics unavailable for this creator.
              </p>
            )}

            <h2 className="font-display text-2xl text-white mb-6 text-left">
              Performance
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {stats.map((stat) => (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  accent={theme?.primary}
                  large={stat.large}
                />
              ))}
            </div>
          </div>

          {rosterPinned && (
            <RosterSidebar className="w-full xl:w-[380px] shrink-0 max-h-[600px] xl:max-h-[calc(100vh-8rem)] rounded-2xl border border-white/10 bg-[#0c0c13]/80 overflow-hidden xl:sticky xl:top-6" />
          )}
        </div>
      </section>

      <RosterDrawer
        open={drawerOpen && !rosterPinned}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
