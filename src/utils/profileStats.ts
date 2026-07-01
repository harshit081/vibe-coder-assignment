import type { FullUserProfile, Platform } from "@/types";
import { getAudienceCountLabel } from "@/utils/formatters";

export interface AnimatedStat {
  label: string;
  primary?: boolean;
  counter?: {
    value: number;
    decimals?: number;
    suffix?: string;
    prefix?: string;
  };
  staticValue?: string;
}

function compactCounter(value: number) {
  if (value >= 1_000_000) {
    return { value: value / 1_000_000, decimals: 1, suffix: "M", prefix: "" };
  }
  if (value >= 1_000) {
    return { value: value / 1_000, decimals: 1, suffix: "K", prefix: "" };
  }
  return { value, decimals: 0, suffix: "", prefix: "" };
}

export function buildAnimatedStats(
  user: FullUserProfile,
  platform: Platform | null
): AnimatedStat[] {
  const stats: AnimatedStat[] = [
    {
      label: platform ? getAudienceCountLabel(platform, true) : "Followers",
      counter: compactCounter(user.followers),
    },
    user.engagement_rate !== undefined
      ? {
          label: "Engagement",
          counter: {
            value: user.engagement_rate * 100,
            decimals: 2,
            suffix: "%",
          },
        }
      : {
          label: "Engagement",
          staticValue: "N/A",
        },
  ];

  if (user.posts_count !== undefined) {
    stats.push({
      label: "Posts",
      counter: { value: user.posts_count, decimals: 0 },
    });
  }
  if (user.avg_likes !== undefined) {
    stats.push({
      label: "Avg Likes",
      counter: compactCounter(user.avg_likes),
    });
  }
  if (user.avg_comments !== undefined) {
    stats.push({
      label: "Avg Comments",
      counter: compactCounter(user.avg_comments),
    });
  }
  if (user.avg_views !== undefined && user.avg_views > 0) {
    stats.push({
      label: "Avg Views",
      counter: compactCounter(user.avg_views),
    });
  }
  if (user.engagements !== undefined) {
    stats.push({
      label: "Engagements",
      counter: compactCounter(user.engagements),
    });
  }

  return stats.map((stat, index) => ({
    ...stat,
    primary: index < 3,
  }));
}
