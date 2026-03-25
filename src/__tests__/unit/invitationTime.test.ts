import { describe, expect, it } from "bun:test";

import { getInviteTimeInfo } from "@/lib/validation/invitation";

import type { GatekeeperInvitation } from "@omnidotdev/providers/auth";

const makeInvitation = (
  overrides: Partial<GatekeeperInvitation> = {},
): GatekeeperInvitation => ({
  id: crypto.randomUUID(),
  email: "test@example.com",
  role: "member",
  status: "pending",
  expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
  inviterId: crypto.randomUUID(),
  organizationId: crypto.randomUUID(),
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe("getInviteTimeInfo", () => {
  it("returns sentAgo as 'just now' for recent invitations", () => {
    const inv = makeInvitation({ createdAt: new Date().toISOString() });
    const info = getInviteTimeInfo(inv);
    expect(info.sentAgo).toBe("just now");
  });

  it("returns sentAgo in hours for older invitations", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const inv = makeInvitation({ createdAt: twoHoursAgo.toISOString() });
    const info = getInviteTimeInfo(inv);
    expect(info.sentAgo).toBe("2h");
  });

  it("returns sentAgo in days for old invitations", () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const inv = makeInvitation({ createdAt: threeDaysAgo.toISOString() });
    const info = getInviteTimeInfo(inv);
    expect(info.sentAgo).toBe("3d");
  });

  it("returns sentAgo in minutes", () => {
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);
    const inv = makeInvitation({ createdAt: tenMinAgo.toISOString() });
    const info = getInviteTimeInfo(inv);
    expect(info.sentAgo).toBe("10m");
  });

  it("marks non-expired invitation correctly", () => {
    const inv = makeInvitation({
      expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
    });
    const info = getInviteTimeInfo(inv);
    expect(info.isExpired).toBe(false);
    expect(info.expiresLabel).toMatch(/^Expires in /);
  });

  it("marks expired invitation correctly", () => {
    const inv = makeInvitation({
      expiresAt: new Date(Date.now() - 3_600_000).toISOString(),
    });
    const info = getInviteTimeInfo(inv);
    expect(info.isExpired).toBe(true);
    expect(info.expiresLabel).toMatch(/^Expired .+ ago$/);
  });
});
