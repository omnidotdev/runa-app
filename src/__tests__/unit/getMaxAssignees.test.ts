import { describe, expect, it } from "bun:test";

import { Tier, getMaxAssignees } from "@/lib/types/tier";

describe("getMaxAssignees", () => {
  // Mirrors the omni-api catalog SSOT (planConfigs.ts runa max_assignees).
  it("allows 2 assignees on the free tier", () => {
    expect(getMaxAssignees(Tier.Free)).toBe(2);
  });

  it("allows 5 assignees on the pro tier", () => {
    expect(getMaxAssignees(Tier.Pro)).toBe(5);
  });

  it("allows unlimited assignees on team and enterprise tiers", () => {
    expect(getMaxAssignees(Tier.Team)).toBe(Number.POSITIVE_INFINITY);
    expect(getMaxAssignees(Tier.Enterprise)).toBe(Number.POSITIVE_INFINITY);
  });
});
