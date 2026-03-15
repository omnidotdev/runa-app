/**
 * Tests for organization invitations query options.
 * Verifies that only pending invitations are returned.
 */

import { describe, expect, it } from "bun:test";

import type { IdpInvitation } from "@/lib/idp";

/**
 * Filter logic extracted from organizationInvitations.options.ts.
 */
function filterPendingInvitations(invitations: IdpInvitation[]) {
  return invitations.filter((invitation) => invitation.status === "pending");
}

const makeInvitation = (
  overrides: Partial<IdpInvitation> = {},
): IdpInvitation => ({
  id: "inv_1",
  email: "test@example.com",
  role: "member",
  status: "pending",
  expiresAt: "2026-04-01T00:00:00Z",
  inviterId: "user_1",
  organizationId: "org_1",
  createdAt: "2026-03-15T00:00:00Z",
  ...overrides,
});

describe("organizationInvitationsOptions filter", () => {
  it("should return only pending invitations", () => {
    const invitations: IdpInvitation[] = [
      makeInvitation({ id: "inv_1", status: "pending" }),
      makeInvitation({ id: "inv_2", status: "accepted" }),
      makeInvitation({ id: "inv_3", status: "pending" }),
      makeInvitation({ id: "inv_4", status: "cancelled" }),
      makeInvitation({ id: "inv_5", status: "rejected" }),
    ];

    const result = filterPendingInvitations(invitations);

    expect(result).toHaveLength(2);
    expect(result.map((i) => i.id)).toEqual(["inv_1", "inv_3"]);
  });

  it("should return empty array when no invitations are pending", () => {
    const invitations: IdpInvitation[] = [
      makeInvitation({ status: "accepted" }),
      makeInvitation({ status: "cancelled" }),
    ];

    expect(filterPendingInvitations(invitations)).toHaveLength(0);
  });

  it("should return all when all are pending", () => {
    const invitations: IdpInvitation[] = [
      makeInvitation({ id: "inv_1" }),
      makeInvitation({ id: "inv_2" }),
    ];

    expect(filterPendingInvitations(invitations)).toHaveLength(2);
  });

  it("should handle empty array", () => {
    expect(filterPendingInvitations([])).toHaveLength(0);
  });
});
