import { describe, expect, it } from "bun:test";

import { validateInvitation } from "@/lib/validation/invitation";

import type { GatekeeperInvitation } from "@omnidotdev/providers/auth";

const makeInvitation = (
  email: string,
  status: GatekeeperInvitation["status"] = "pending",
): GatekeeperInvitation => ({
  id: crypto.randomUUID(),
  email,
  role: "member",
  status,
  expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
  inviterId: crypto.randomUUID(),
  organizationId: crypto.randomUUID(),
  createdAt: new Date().toISOString(),
});

describe("validateInvitation", () => {
  describe("duplicate pending invitation", () => {
    it("rejects email with an existing pending invitation", () => {
      const pendingInvitations = [makeInvitation("alice@example.com")];

      const result = validateInvitation({
        email: "alice@example.com",
        pendingInvitations,
        memberEmails: [],
      });

      expect(result).toEqual({
        valid: false,
        reason: "An invitation is already pending for this email",
      });
    });

    it("rejects case-insensitively", () => {
      const pendingInvitations = [makeInvitation("Alice@Example.com")];

      const result = validateInvitation({
        email: "alice@example.com",
        pendingInvitations,
        memberEmails: [],
      });

      expect(result).toEqual({
        valid: false,
        reason: "An invitation is already pending for this email",
      });
    });

    it("ignores non-pending invitations", () => {
      const pendingInvitations = [
        makeInvitation("alice@example.com", "cancelled"),
      ];

      const result = validateInvitation({
        email: "alice@example.com",
        pendingInvitations,
        memberEmails: [],
      });

      expect(result).toEqual({ valid: true });
    });
  });

  describe("existing member", () => {
    it("rejects email that is already an org member", () => {
      const result = validateInvitation({
        email: "bob@example.com",
        pendingInvitations: [],
        memberEmails: ["bob@example.com"],
      });

      expect(result).toEqual({
        valid: false,
        reason: "This email is already a member of the organization",
      });
    });

    it("rejects case-insensitively", () => {
      const result = validateInvitation({
        email: "Bob@Example.com",
        pendingInvitations: [],
        memberEmails: ["bob@example.com"],
      });

      expect(result).toEqual({
        valid: false,
        reason: "This email is already a member of the organization",
      });
    });
  });

  describe("valid invitation", () => {
    it("accepts email with no conflicts", () => {
      const result = validateInvitation({
        email: "new@example.com",
        pendingInvitations: [makeInvitation("other@example.com")],
        memberEmails: ["existing@example.com"],
      });

      expect(result).toEqual({ valid: true });
    });

    it("accepts with empty lists", () => {
      const result = validateInvitation({
        email: "new@example.com",
        pendingInvitations: [],
        memberEmails: [],
      });

      expect(result).toEqual({ valid: true });
    });
  });
});
