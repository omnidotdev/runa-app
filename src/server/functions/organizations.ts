import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import gatekeeperOrg from "@/lib/config/gatekeeper";
import { validateInvitation } from "@/lib/validation/invitation";
import { authMiddleware } from "@/server/middleware";

export type { GatekeeperOrganization as Organization } from "@omnidotdev/providers/auth";

const createOrganizationSchema = z.object({
  name: z.string().min(3, "Organization name must be at least 3 characters"),
  slug: z.string().optional(),
});

const getOrganizationBySlugSchema = z.object({
  slug: z.string().min(1),
});

/**
 * Create a new organization via Gatekeeper.
 * @knipignore
 */
export const createOrganization = createServerFn({ method: "POST" })
  .inputValidator((data) => createOrganizationSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const accessToken = context.session.accessToken;

    if (!accessToken) {
      throw new Error("No access token available");
    }

    return gatekeeperOrg.createOrganization(data, accessToken);
  });

const inviteOrganizationMemberSchema = z.object({
  organizationId: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "member"]),
});

/**
 * Invite a member to an organization via Gatekeeper.
 * Runs server-side to avoid CORS issues with the IDP's Better Auth endpoint
 */
export const inviteOrganizationMember = createServerFn({ method: "POST" })
  .inputValidator((data) => inviteOrganizationMemberSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const accessToken = context.session.accessToken;

    if (!accessToken) {
      throw new Error("No access token available");
    }

    // Check for duplicate pending invitations and existing members
    const [invitations, membersResponse] = await Promise.all([
      gatekeeperOrg.listInvitations(data.organizationId, accessToken),
      gatekeeperOrg.listMembers(data.organizationId, accessToken),
    ]);

    const result = validateInvitation({
      email: data.email,
      pendingInvitations: invitations,
      memberEmails: membersResponse.data.map((m) => m.user.email),
    });

    if (!result.valid) {
      throw new Error(result.reason);
    }

    return gatekeeperOrg.inviteMember(data, accessToken);
  });

const resendOrganizationInvitationSchema = z.object({
  organizationId: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "member"]),
});

/**
 * Resend an invitation (active or expired).
 * Skips the active-pending check since Gatekeeper's
 * `cancelPendingInvitationsOnReInvite` auto-cancels the old one
 */
export const resendOrganizationInvitation = createServerFn({ method: "POST" })
  .inputValidator((data) => resendOrganizationInvitationSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const accessToken = context.session.accessToken;

    if (!accessToken) {
      throw new Error("No access token available");
    }

    // Only check that the email isn't already a member
    const membersResponse = await gatekeeperOrg.listMembers(
      data.organizationId,
      accessToken,
    );

    const isExistingMember = membersResponse.data.some(
      (m) => m.user.email.toLowerCase() === data.email.toLowerCase(),
    );

    if (isExistingMember) {
      throw new Error("This email is already a member of the organization");
    }

    return gatekeeperOrg.inviteMember(data, accessToken);
  });

const listOrganizationInvitationsSchema = z.object({
  organizationId: z.string(),
});

/**
 * List invitations for an organization via Gatekeeper.
 * Runs server-side to avoid CORS issues with the IDP's Better Auth endpoint
 */
export const listOrganizationInvitations = createServerFn({ method: "GET" })
  .inputValidator((data) => listOrganizationInvitationsSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const accessToken = context.session.accessToken;

    if (!accessToken) {
      throw new Error("No access token available");
    }

    return gatekeeperOrg.listInvitations(data.organizationId, accessToken);
  });

const cancelOrganizationInvitationSchema = z.object({
  invitationId: z.string(),
});

/**
 * Cancel an organization invitation via Gatekeeper.
 * Runs server-side to avoid CORS issues with the IDP's Better Auth endpoint
 */
export const cancelOrganizationInvitation = createServerFn({ method: "POST" })
  .inputValidator((data) => cancelOrganizationInvitationSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const accessToken = context.session.accessToken;

    if (!accessToken) {
      throw new Error("No access token available");
    }

    return gatekeeperOrg.cancelInvitation(data.invitationId, accessToken);
  });

/**
 * Get an organization by slug.
 * Used when JWT claims are stale and don't include a newly created org
 */
export const getOrganizationBySlug = createServerFn({ method: "GET" })
  .inputValidator((data) => getOrganizationBySlugSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const accessToken = context.session.accessToken;

    if (!accessToken) {
      return null;
    }

    return gatekeeperOrg.getOrganizationBySlug(data.slug, accessToken);
  });

/**
 * Fetch an organization by slug without authentication.
 * Used for public board access when no JWT is available
 */
export const fetchOrganizationBySlug = createServerFn()
  .inputValidator((data) => getOrganizationBySlugSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      return await gatekeeperOrg.fetchOrganizationBySlug(data.slug);
    } catch (error) {
      console.error("Error fetching organization by slug:", error);
      return null;
    }
  });
