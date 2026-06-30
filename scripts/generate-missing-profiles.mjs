import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const searchDir = join(root, "src/assets/data/search");
const profilesDir = join(root, "src/assets/data/profiles");

const platformFiles = {
  instagram: "instagram.json",
  youtube: "youtube.json",
  tiktok: "tiktok.json",
};

const descriptions = {
  leomessi: "Professional footballer. World Cup champion.",
  selenagomez: "Artist, entrepreneur, and founder of Rare Beauty.",
  kyliejenner: "Founder of Kylie Cosmetics.",
  therock: "Actor, producer, and businessman.",
  arianagrande: "Singer, songwriter, and actress.",
  kimkardashian: "SKIMS founder and media personality.",
  beyonce: "Singer, songwriter, and performer.",
  khloekardashian: "Television personality and entrepreneur.",
  VladandNiki: "Family-friendly adventures and fun stories for kids.",
  KidsDianaShow: "Kids entertainment, toys, and family-friendly videos.",
  LikeNastyaofficial: "Kids content and family entertainment.",
  setindia: "Official YouTube channel for Sony Entertainment Television India.",
  zeemusiccompany: "Bollywood music and entertainment videos.",
  PewDiePie: "Gaming, commentary, and internet culture.",
  WWEFanNation: "Official WWE highlights, matches, and behind-the-scenes content.",
  charlidamelio: "Dancer and content creator.",
  willsmith: "Actor, producer, and entertainer.",
  bellapoarch: "Singer and content creator.",
  addisonre: "Dancer, actress, and content creator.",
  "kimberly.loaiza": "Content creator and musician.",
  tiktok: "Make Your Day — short-form video platform.",
  zachking: "Digital magician and filmmaker.",
  domelipa: "Content creator and live streamer.",
};

function existingProfileUsernames() {
  return new Set(
    readdirSync(profilesDir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, "").toLowerCase())
  );
}

function estimatePostsCount(platform, followers) {
  if (platform === "instagram") return Math.min(8000, Math.max(120, Math.round(followers / 500000)));
  if (platform === "youtube") return Math.min(5000, Math.max(50, Math.round(followers / 800000)));
  return Math.min(1200, Math.max(80, Math.round(followers / 1000000)));
}

function buildProfileDetail(platform, summary) {
  const username = summary.username;
  if (!username) return null;

  const followers = summary.followers ?? 0;
  const engagements = summary.engagements ?? Math.round(followers * (summary.engagement_rate ?? 0.01));
  const avgLikes = Math.round(engagements * 0.92);
  const avgComments = Math.max(1, Math.round(engagements * 0.04));
  const postsCount = estimatePostsCount(platform, followers);

  const userProfile = {
    type: platform,
    user_id: summary.user_id,
    username,
    url: summary.url,
    picture: summary.picture,
    fullname: summary.fullname,
    description: descriptions[username] ?? `${summary.fullname} on ${platform}.`,
    is_verified: summary.is_verified ?? false,
    is_business: platform === "instagram" ? summary.account_type === 3 : undefined,
    is_hidden: false,
    followers,
    posts_count: postsCount,
    engagements,
    engagement_rate: summary.engagement_rate ?? engagements / Math.max(followers, 1),
    avg_likes: avgLikes,
    avg_comments: avgComments,
    avg_views: summary.avg_views ?? 0,
  };

  if (summary.handle) userProfile.handle = summary.handle;
  if (summary.sec_uid) userProfile.sec_uid = summary.sec_uid;
  if (platform === "instagram") userProfile.account_type = summary.account_type ?? 3;
  if (platform === "instagram" && summary.avg_views === undefined) {
    userProfile.avg_reels_plays = Math.round(followers * 0.02);
  }

  Object.keys(userProfile).forEach((key) => {
    if (userProfile[key] === undefined) delete userProfile[key];
  });

  return {
    cached: true,
    contact: { showEmail: false, showPhone: false },
    data: {
      success: true,
      version: "2",
      report_info: {
        report_id: `gen-${username.toLowerCase()}`,
        created: "2024-06-01T12:00:00.000+00:00",
        profile_updated: "2024-06-01T12:00:00.000+00:00",
      },
      user_profile: userProfile,
    },
  };
}

const existing = existingProfileUsernames();
const created = [];
const skipped = [];

for (const [platform, filename] of Object.entries(platformFiles)) {
  const searchData = JSON.parse(readFileSync(join(searchDir, filename), "utf8"));

  for (const item of searchData.accounts) {
    const summary = item.account.user_profile;
    const username = summary.username;

    if (!username) {
      skipped.push(`${platform}: ${summary.fullname} (no username in search data)`);
      continue;
    }

    if (existing.has(username.toLowerCase())) continue;

    const detail = buildProfileDetail(platform, summary);
    const outPath = join(profilesDir, `${username}.json`);

    if (existsSync(outPath)) continue;

    writeFileSync(outPath, JSON.stringify(detail, null, 4) + "\n", "utf8");
    existing.add(username.toLowerCase());
    created.push(`${username}.json (${platform})`);
  }
}

console.log(`Created ${created.length} profile files:`);
created.forEach((f) => console.log(`  - ${f}`));
if (skipped.length) {
  console.log(`\nSkipped ${skipped.length} entries without username:`);
  skipped.forEach((s) => console.log(`  - ${s}`));
}
