import { describe, expect, it } from "vitest";

import { buildRosterJsonExport, buildRosterTextExport } from "@/utils/rosterExport";
import type { SelectedProfile } from "@/types";

const FIXED_DATE = new Date("2026-07-02T07:00:00.000Z");

function makeSelected(i: number): SelectedProfile {
  return {
    id: `instagram:user${i}`,
    platform: "instagram",
    addedAt: 0,
    profile: {
      user_id: `${i}`,
      username: `user${i}`,
      url: "https://example.com",
      picture: "https://example.com/p.png",
      fullname: `User ${i}`,
      is_verified: false,
      followers: 1000 + i,
    },
  };
}

describe("buildRosterTextExport", () => {
  it("includes a header and numbered lines", () => {
    const originalNow = Date;
    // Make `new Date()` deterministic for this test.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).Date = class extends Date {
      constructor() {
        super(FIXED_DATE);
      }
      static now() {
        return FIXED_DATE.getTime();
      }
    } as unknown as DateConstructor;

    const text = buildRosterTextExport([makeSelected(1), makeSelected(2)]);

    // Restore Date
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).Date = originalNow;

    expect(text).toContain("CAMPAIGN ROSTER");
    expect(text).toContain("Total: 2");
    expect(text).toMatch(/\n1\. User 1 \(@user1\) — instagram/);
    expect(text).toMatch(/\n2\. User 2 \(@user2\) — instagram/);
  });
});

describe("buildRosterJsonExport", () => {
  it("produces JSON with exportedAt, count, and roster", () => {
    const originalNow = Date;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).Date = class extends Date {
      constructor() {
        super(FIXED_DATE);
      }
      static now() {
        return FIXED_DATE.getTime();
      }
    } as unknown as DateConstructor;

    const json = buildRosterJsonExport([makeSelected(1)]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).Date = originalNow;

    const parsed = JSON.parse(json) as {
      exportedAt: string;
      count: number;
      roster: SelectedProfile[];
    };

    expect(parsed.count).toBe(1);
    expect(parsed.exportedAt).toBe(FIXED_DATE.toISOString());
    expect(parsed.roster[0]?.profile.username).toBe("user1");
  });
});

