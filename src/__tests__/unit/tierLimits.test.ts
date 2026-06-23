import { describe, expect, it } from "bun:test";

import {
  Tier,
  getMaxAdmins,
  getMaxAttachmentBytes,
  getMaxColumns,
  getMaxLabels,
  getMaxMembers,
  getMaxProjects,
  getMaxTasks,
} from "@/lib/types/tier";

const UNLIMITED = Number.POSITIVE_INFINITY;

// All expectations mirror the omni-api catalog SSOT (planConfigs.ts `runa`
// `operationalLimits`); -1 in the catalog maps to positive infinity here.
describe("runa tier limit helpers", () => {
  it("mirrors free-tier limits", () => {
    expect(getMaxProjects(Tier.Free)).toBe(5);
    expect(getMaxTasks(Tier.Free)).toBe(1500);
    expect(getMaxColumns(Tier.Free)).toBe(10);
    expect(getMaxLabels(Tier.Free)).toBe(25);
    expect(getMaxMembers(Tier.Free)).toBe(5);
    expect(getMaxAdmins(Tier.Free)).toBe(1);
    expect(getMaxAttachmentBytes(Tier.Free)).toBe(26_214_400);
  });

  it("mirrors pro-tier limits", () => {
    expect(getMaxProjects(Tier.Pro)).toBe(50);
    expect(getMaxTasks(Tier.Pro)).toBe(25_000);
    expect(getMaxColumns(Tier.Pro)).toBe(50);
    expect(getMaxLabels(Tier.Pro)).toBe(100);
    expect(getMaxMembers(Tier.Pro)).toBe(25);
    expect(getMaxAdmins(Tier.Pro)).toBe(UNLIMITED);
    expect(getMaxAttachmentBytes(Tier.Pro)).toBe(104_857_600);
  });

  it("treats team limits as unlimited except per-file attachment cap", () => {
    expect(getMaxProjects(Tier.Team)).toBe(UNLIMITED);
    expect(getMaxTasks(Tier.Team)).toBe(UNLIMITED);
    expect(getMaxColumns(Tier.Team)).toBe(UNLIMITED);
    expect(getMaxLabels(Tier.Team)).toBe(UNLIMITED);
    expect(getMaxMembers(Tier.Team)).toBe(UNLIMITED);
    expect(getMaxAdmins(Tier.Team)).toBe(UNLIMITED);
    expect(getMaxAttachmentBytes(Tier.Team)).toBe(262_144_000);
  });

  it("inherits team limits for the enterprise tier", () => {
    expect(getMaxProjects(Tier.Enterprise)).toBe(UNLIMITED);
    expect(getMaxAttachmentBytes(Tier.Enterprise)).toBe(262_144_000);
  });
});
