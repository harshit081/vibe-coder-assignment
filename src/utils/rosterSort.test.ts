import { describe, expect, it } from "vitest";

import { sortRosterProfiles } from "@/utils/rosterSort";
import type { SelectedProfile } from "@/types";

function makeSelected(
  platform: SelectedProfile["platform"],
  fullname: string,
  followers: number
): SelectedProfile {
  return {
    id: `${platform}:${fullname}`,
    platform,
    addedAt: Date.now(),
    profile: {
      user_id: `${platform}-${fullname}`,
      username: fullname.toLowerCase().replaceAll(" ", ""),
      url: "https://example.com",
      picture: "https://example.com/p.png",
      fullname,
      is_verified: false,
      followers,
    },
  };
}

describe("sortRosterProfiles", () => {
  it("sorts by name (case-insensitive A–Z)", () => {
    const input = [
      makeSelected("instagram", "zoe", 1),
      makeSelected("instagram", "Álvaro", 1),
      makeSelected("instagram", "anna", 1),
    ];

    const sorted = sortRosterProfiles(input, "name");
    expect(sorted.map((x) => x.profile.fullname)).toEqual([
      "Álvaro",
      "anna",
      "zoe",
    ]);
  });

  it("sorts by followers descending", () => {
    const input = [
      makeSelected("instagram", "a", 10),
      makeSelected("instagram", "b", 30),
      makeSelected("instagram", "c", 20),
    ];

    const sorted = sortRosterProfiles(input, "followers");
    expect(sorted.map((x) => x.profile.followers)).toEqual([30, 20, 10]);
  });

  it("sorts by platform order (IG → YT → TikTok), tie-break by followers desc", () => {
    const input = [
      makeSelected("tiktok", "t1", 5),
      makeSelected("youtube", "y1", 1),
      makeSelected("instagram", "i1", 2),
      makeSelected("youtube", "y2", 10),
    ];

    const sorted = sortRosterProfiles(input, "platform");
    expect(sorted.map((x) => `${x.platform}:${x.profile.fullname}`)).toEqual([
      "instagram:i1",
      "youtube:y2",
      "youtube:y1",
      "tiktok:t1",
    ]);
  });
});

