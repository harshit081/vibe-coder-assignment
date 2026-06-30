import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, Platform, ProfileDetailResponse } from "@/types";
import {
  formatEngagementRate,
  formatFollowers,
} from "@/utils/formatters";
import { isDetailedProfile, loadProfileByUsername } from "@/utils/profileLoader";

const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

function parsePlatform(value: string | null): Platform | null {
  if (value && PLATFORMS.includes(value as Platform)) {
    return value as Platform;
  }
  return null;
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = parsePlatform(searchParams.get("platform"));
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(
    null
  );
  const [loadedUsername, setLoadedUsername] = useState<string | null>(null);
  const [hasDetailedData, setHasDetailedData] = useState(false);

  useEffect(() => {
    if (!username) return;

    let cancelled = false;

    loadProfileByUsername(username, platform).then((data) => {
      if (cancelled) return;
      setProfileData(data);
      setLoadedUsername(username);
      setHasDetailedData(data ? isDetailedProfile(username) : false);
    });

    return () => {
      cancelled = true;
    };
  }, [username, platform]);

  const isLoading = loadedUsername !== username;

  if (!username) {
    return (
      <Layout>
        <p>Invalid profile</p>
        <Link to="/">Back</Link>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout title={`@${username}`}>
        <p className="text-gray-400">Loading...</p>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <p className="text-red-600 mb-4">
          Could not load profile details for {username}
        </p>
        <Link to="/" className="text-blue-600 underline">
          Back to search
        </Link>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;

  return (
    <Layout title={user.fullname}>
      <Link to="/" className="text-sm text-blue-600 mb-4 inline-block">
        ← Back to search
      </Link>

      {!hasDetailedData && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-4 max-w-2xl mx-auto">
          Showing summary data from search results. Extended profile details are
          not available for this creator.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-6 items-start text-left max-w-2xl mx-auto">
        <img
          src={user.picture}
          alt={`${user.fullname} profile`}
          className="w-24 h-24 rounded-full border shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold">
            @{user.username}
            <VerifiedBadge verified={user.is_verified} />
          </h2>
          <p className="text-gray-600">{user.fullname}</p>
          {platform && (
            <p className="text-xs text-gray-400 mt-1 capitalize">
              Platform: {platform}
            </p>
          )}

          {user.description && (
            <p className="mt-3 text-sm text-gray-700">{user.description}</p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="border p-2 rounded">
              <div className="text-gray-500">Followers</div>
              <div className="font-semibold">{formatFollowers(user.followers)}</div>
            </div>
            <div className="border p-2 rounded">
              <div className="text-gray-500">Engagement Rate</div>
              <div className="font-semibold">
                {formatEngagementRate(user.engagement_rate)}
              </div>
            </div>
            {user.posts_count !== undefined && (
              <div className="border p-2 rounded">
                <div className="text-gray-500">Posts</div>
                <div className="font-semibold">{user.posts_count}</div>
              </div>
            )}
            {user.avg_likes !== undefined && (
              <div className="border p-2 rounded">
                <div className="text-gray-500">Avg Likes</div>
                <div className="font-semibold">
                  {formatFollowers(user.avg_likes)}
                </div>
              </div>
            )}
            {user.avg_comments !== undefined && (
              <div className="border p-2 rounded">
                <div className="text-gray-500">Avg Comments</div>
                <div className="font-semibold">
                  {formatFollowers(user.avg_comments)}
                </div>
              </div>
            )}
            {user.avg_views !== undefined && user.avg_views > 0 && (
              <div className="border p-2 rounded">
                <div className="text-gray-500">Avg Views</div>
                <div className="font-semibold">
                  {formatFollowers(user.avg_views)}
                </div>
              </div>
            )}
            {user.engagements !== undefined && (
              <div className="border p-2 rounded">
                <div className="text-gray-500">Engagements</div>
                <div className="font-semibold">
                  {formatFollowers(user.engagements)}
                </div>
              </div>
            )}
          </div>

          {user.url && (
            <a
              href={user.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-blue-600 text-sm"
            >
              View on platform →
            </a>
          )}

          {/* TODO: candidates must implement Add to List feature */}
          <button
            disabled
            className="block mt-4 px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed"
          >
            Add to List
          </button>
        </div>
      </div>
    </Layout>
  );
}
