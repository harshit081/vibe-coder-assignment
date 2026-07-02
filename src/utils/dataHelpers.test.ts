import { describe, expect, it } from "vitest";

import {
  extractProfiles,
  filterProfiles,
  findProfileByUsername,
  getPlatformLabel,
} from "@/utils/dataHelpers";

describe("dataHelpers", () => {
  it("extractProfiles returns 10 profiles per platform dataset", () => {
    expect(extractProfiles("instagram")).toHaveLength(10);
    expect(extractProfiles("youtube")).toHaveLength(10);
    expect(extractProfiles("tiktok")).toHaveLength(10);
  });

  it("filterProfiles is case-insensitive for username and fullname, and trims query", () => {
    const profiles = [
      {
        user_id: "1",
        username: "MrBeast6000",
        url: "x",
        picture: "x",
        fullname: "MrBeast",
        is_verified: true,
        followers: 1,
      },
      {
        user_id: "2",
        username: "instagram",
        url: "x",
        picture: "x",
        fullname: "Instagram",
        is_verified: true,
        followers: 1,
      },
    ];

    expect(filterProfiles(profiles, "  mrbeast  ")).toHaveLength(1);
    expect(filterProfiles(profiles, "INSTAGRAM")).toHaveLength(1);
    expect(filterProfiles(profiles, "  ")).toBe(profiles);
  });

  it("findProfileByUsername matches case-insensitively against platform dataset", () => {
    const found = findProfileByUsername("MRBEAST6000", "youtube");
    expect(found?.username).toBe("MrBeast6000");
  });

  it("getPlatformLabel returns human labels", () => {
    expect(getPlatformLabel("instagram")).toBe("Instagram");
    expect(getPlatformLabel("youtube")).toBe("YouTube");
    expect(getPlatformLabel("tiktok")).toBe("TikTok");
  });
});

