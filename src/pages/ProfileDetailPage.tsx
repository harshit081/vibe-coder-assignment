import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { AddToListButton } from "@/components/AddToListButton";
import { HeroPortrait } from "@/components/HeroPortrait";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { Typewriter } from "@/components/motion/Typewriter";
import { PlatformBadge } from "@/components/PlatformBadge";
import { RosterDrawer } from "@/components/RosterDrawer";
import { RosterToolbar } from "@/components/RosterToolbar";
import { VideoBackground } from "@/components/layout/VideoBackground";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, Platform, ProfileDetailResponse } from "@/types";
import { getPlatformTheme } from "@/theme/platformThemes";
import { buildAnimatedStats } from "@/utils/profileStats";
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

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-svh overflow-x-hidden">
      <VideoBackground />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const queryPlatform = parsePlatformParamNullable(searchParams.get("platform"));
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
      <PageShell>
        <div className="flex min-h-svh items-center justify-center px-4">
          <Link
            to={buildSearchUrl(queryPlatform)}
            className="glass-bubble rounded-full px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            ← Back to discovery
          </Link>
        </div>
      </PageShell>
    );
  }

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex min-h-svh flex-col items-center justify-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-2 border-pink-500/25 border-t-pink-400" />
          <p className="text-sm uppercase tracking-[0.2em] text-white/40">
            Loading creator…
          </p>
        </div>
      </PageShell>
    );
  }

  if (!profileData) {
    return (
      <PageShell>
        <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-red-300">Could not load profile for @{username}</p>
          <Link
            to={buildSearchUrl(queryPlatform)}
            className="glass-bubble rounded-full px-5 py-2.5 text-sm font-medium text-pink-300 transition-colors hover:text-pink-200"
          >
            ← Back to discovery
          </Link>
        </div>
      </PageShell>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const platform = resolvePlatform(queryPlatform, user.type);
  const theme = platform ? getPlatformTheme(platform) : null;
  const backUrl = buildSearchUrl(platform ?? queryPlatform);
  const hasDetailedData = isDetailedProfile(username);
  const stats = buildAnimatedStats(user, platform);

  return (
    <PageShell>
      {theme && (
        <div
          className="pointer-events-none fixed inset-x-0 top-0 z-[1] h-1"
          style={{ background: theme.gradient }}
          aria-hidden="true"
        />
      )}

      {theme && (
        <div
          className="pointer-events-none fixed -right-32 top-24 h-[420px] w-[420px] rounded-full opacity-25 blur-[120px]"
          style={{ background: theme.primary }}
          aria-hidden="true"
        />
      )}

      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 sm:gap-3">
          <Link
            to={backUrl}
            className="glass-bubble inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-white/75 transition-colors hover:text-white sm:px-4 sm:text-sm"
          >
            ← Discovery
          </Link>
          <div className="flex items-center gap-2">
            {platform && <PlatformBadge platform={platform} />}
            <RosterToolbar onOpenDrawer={() => setDrawerOpen(true)} />
          </div>
        </div>
      </header>

      <main className="pb-16 pt-20 sm:pt-24 sm:pb-16 lg:pt-28">
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-end gap-7 sm:gap-10 lg:grid-cols-[minmax(260px,40%)_1fr] lg:gap-14 xl:gap-16">
            <div className="animate-fade-up">
              <HeroPortrait
                username={user.username}
                fullname={user.fullname}
                fallbackSrc={user.picture}
                glowColor={theme?.glow ?? "rgba(255,255,255,0.2)"}
                className="min-h-[260px] sm:min-h-[420px] lg:min-h-[min(72vh,640px)] lg:justify-start"
              />
            </div>

            <div className="animate-fade-up-delay-1 space-y-4 pb-4 sm:space-y-6 lg:pb-10">
              <div className="space-y-3 sm:space-y-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40 sm:text-[11px] sm:tracking-[0.28em]">
                  Creator profile
                </p>
                {theme && (
                  <div
                    className="h-0.5 w-10 rounded-full sm:h-1 sm:w-14"
                    style={{ background: theme.gradient }}
                    aria-hidden="true"
                  />
                )}
                <h1 className="font-display text-2xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                  {user.fullname}
                </h1>
                <p className="text-base text-white/70 sm:text-xl">
                  @{user.username}
                  <VerifiedBadge verified={user.is_verified} />
                </p>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
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
                    className="glass-bubble inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10 sm:px-5 sm:py-2.5 sm:text-sm"
                  >
                    View on platform ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {(user.description || user.gender || user.age_group) && (
          <section className="mx-auto mt-8 max-w-6xl px-4 sm:mt-14 sm:px-6">
            <div className="glass-card overflow-hidden rounded-2xl border border-white/15 sm:rounded-3xl">
              <div className="border-b border-white/10 px-4 py-4 sm:px-8 sm:py-5">
                <h2 className="font-display text-xl font-bold text-white sm:text-3xl">
                  About
                </h2>
                <p className="mt-1 text-xs text-white/40 sm:text-sm">
                  Bio and profile details
                </p>
              </div>

              <div className="space-y-4 px-4 py-5 sm:space-y-5 sm:px-8 sm:py-8">
                {user.description && (
                  <p className="max-w-3xl text-sm leading-relaxed text-white/70 sm:text-lg">
                    <Typewriter
                      text={user.description}
                      delay={0.1}
                      speed={0.012}
                    />
                  </p>
                )}

                {(user.gender || user.age_group) && (
                  <div
                    className={`flex flex-wrap gap-2 ${
                      user.description ? "border-t border-white/10 pt-5" : ""
                    }`}
                  >
                    {user.gender && (
                      <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/55">
                        {user.gender}
                      </span>
                    )}
                    {user.age_group && (
                      <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/55">
                        {user.age_group}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="mx-auto mt-8 max-w-6xl px-4 sm:mt-14 sm:px-6">
          <div className="glass-card overflow-hidden rounded-2xl border border-white/15 sm:rounded-3xl">
            <div className="border-b border-white/10 px-4 py-4 sm:px-8 sm:py-5">
              <h2 className="font-display text-xl font-bold text-white sm:text-3xl">
                Performance
              </h2>
              <p className="mt-1 text-xs text-white/40 sm:text-sm">
                Audience and engagement metrics for this creator
              </p>
            </div>

            <div className="space-y-5 px-4 py-5 sm:space-y-6 sm:px-8 sm:py-8">
              {!hasDetailedData && (
                <p className="rounded-2xl border border-amber-500/25 bg-amber-500/10 px-3 py-2.5 text-xs text-amber-200/90 sm:px-4 sm:py-3 sm:text-sm">
                  Limited stats — extended analytics unavailable for this creator.
                </p>
              )}

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 sm:px-4 sm:py-4"
                    style={
                      stat.primary && theme
                        ? {
                            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 28px -12px ${theme.primary}`,
                          }
                        : undefined
                    }
                  >
                    <p className="text-[9px] font-medium uppercase tracking-wider text-white/45 sm:text-[11px]">
                      {stat.label}
                    </p>
                    <p
                      className={`mt-1.5 font-bold tabular-nums text-white ${
                        stat.primary ? "text-xl sm:text-3xl" : "text-lg sm:text-2xl"
                      }`}
                    >
                      {stat.counter ? (
                        <AnimatedCounter
                          value={stat.counter.value}
                          decimals={stat.counter.decimals}
                          suffix={stat.counter.suffix}
                          prefix={stat.counter.prefix}
                        />
                      ) : (
                        stat.staticValue
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <RosterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </PageShell>
  );
}
