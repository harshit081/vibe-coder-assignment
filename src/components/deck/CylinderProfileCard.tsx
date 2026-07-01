import { Link } from "react-router-dom";
import { AddToListButton } from "@/components/AddToListButton";
import { ProfilePicture } from "@/components/ProfilePicture";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { getPlatformTheme } from "@/theme/platformThemes";
import type { Platform, UserProfileSummary } from "@/types";
import {
  formatEngagementRate,
  formatFollowers,
} from "@/utils/formatters";

const THICKNESS_LAYERS = [-1.47, -0.73, 0, 0.73, 1.47];

interface CylinderProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  cardW: number;
  cardH: number;
  expanded: boolean;
  onSelect: () => void;
  onClose: () => void;
}

export function CylinderProfileCard({
  profile,
  platform,
  cardW,
  cardH,
  expanded,
  onSelect,
  onClose,
}: CylinderProfileCardProps) {
  const theme = getPlatformTheme(platform);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        width: cardW,
        height: cardH,
        transformStyle: "preserve-3d",
      }}
    >
      {THICKNESS_LAYERS.map((zOffset, layerIdx) => {
        const isFront = layerIdx === THICKNESS_LAYERS.length - 1;
        const isBack = layerIdx === 0;

        if (!isFront && !isBack) {
          return (
            <div
              key={layerIdx}
              className="absolute inset-0 rounded-2xl border border-white/10"
              style={{
                backgroundColor: "#606060",
                transform: `translateZ(${zOffset}px)`,
              }}
            />
          );
        }

        if (isFront) {
          return (
            <div
              key={layerIdx}
              className="absolute inset-0 rounded-2xl border border-white/15 overflow-hidden"
              style={{
                backgroundColor: "#0f0f0f",
                transform: `translateZ(${zOffset}px)`,
                backfaceVisibility: "hidden",
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.15)",
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!expanded) onSelect();
                }}
                className={`relative h-full w-full text-left pointer-events-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                  expanded ? "cursor-default" : "cursor-pointer"
                }`}
              >
                <div
                  className="absolute inset-x-0 top-0 z-10 h-1.5"
                  style={{ background: theme.gradient }}
                  aria-hidden="true"
                />

                {expanded && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    aria-label="Close"
                    className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-lg text-white hover:bg-black/75 transition-colors pointer-events-auto"
                  >
                    ×
                  </button>
                )}

                <div
                  className={`relative overflow-hidden ${
                    expanded ? "h-[48%]" : "h-[62%]"
                  }`}
                >
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

                <div
                  className={`relative flex flex-col p-4 ${
                    expanded ? "gap-3 pt-3" : "h-[38%] justify-between pt-3"
                  }`}
                >
                  <div>
                    <p className="font-display text-base font-bold leading-tight text-white sm:text-lg">
                      {profile.fullname}
                    </p>
                    <p className="mt-1 text-xs text-zinc-300 sm:text-sm">
                      @{profile.username}
                      <VerifiedBadge verified={profile.is_verified} />
                    </p>
                  </div>

                  {!expanded ? (
                    <div>
                      <p className="text-lg font-semibold tabular-nums text-white">
                        {formatFollowers(profile.followers)}
                      </p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-zinc-500">
                        followers
                      </p>
                    </div>
                  ) : (
                    <div
                      className="space-y-3 pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <Stat label="Followers" value={formatFollowers(profile.followers)} />
                        {profile.engagement_rate !== undefined && (
                          <Stat
                            label="Engagement"
                            value={formatEngagementRate(profile.engagement_rate)}
                          />
                        )}
                        {profile.avg_views !== undefined && profile.avg_views > 0 && (
                          <Stat
                            label="Avg views"
                            value={formatFollowers(profile.avg_views)}
                          />
                        )}
                        {profile.engagements !== undefined && (
                          <Stat
                            label="Engagements"
                            value={formatFollowers(profile.engagements)}
                          />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <AddToListButton profile={profile} platform={platform} size="sm" />
                        <Link
                          to={`/profile/${profile.username}?platform=${platform}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                        >
                          Full showcase →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            </div>
          );
        }

        return (
          <div
            key={layerIdx}
            className="absolute inset-0 rounded-2xl border border-white/15 overflow-hidden"
            style={{
              backgroundColor: "#0f0f0f",
              transform: `translateZ(${zOffset}px) rotateY(180deg)`,
              backfaceVisibility: "hidden",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.15)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ filter: "blur(16px)", transform: "scale(1.15)" }}
            >
              <ProfilePicture
                username={profile.username}
                src={profile.picture}
                platform={platform}
                handle={profile.handle}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div
              className="absolute inset-x-0 top-4 h-8 sm:h-9 z-10"
              style={{ background: "rgba(0,0,0,0.85)" }}
            />

            <div
              className="absolute left-4 bottom-4 z-20 flex flex-col gap-1 text-left font-mono"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            >
              <div className="text-[10px] font-medium tracking-[0.12em] text-white/90 uppercase">
                @{profile.username}
              </div>
              <div className="text-[9px] font-medium tracking-wide text-white/60">
                {formatFollowers(profile.followers)} · {platform}
              </div>
              {profile.engagement_rate !== undefined && (
                <div className="text-[9px] text-white/45">
                  ENG {formatEngagementRate(profile.engagement_rate)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
      <p className="text-[9px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-0.5 text-xs font-bold tabular-nums text-white">{value}</p>
    </div>
  );
}
