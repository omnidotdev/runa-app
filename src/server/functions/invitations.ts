import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  InvitationStatus,
  MemberRole,
  OrganizationType,
} from "@/generated/graphql";
import { BASE_URL } from "@/lib/config/env.config";
import getSdk from "@/lib/graphql/getSdk";
import { sendInviteEmail } from "@/server/functions/emails";
import { authMiddleware } from "@/server/middleware";

import type { IdpInvitation } from "@/lib/idp/client";

/** Invite link expiry (7 days) */
const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const createInviteSchema = z.object({
  organizationId: z.string().min(1),
  email: z.string().optional(),
  role: z.enum(["admin", "member"]),
});

const acceptInviteSchema = z.object({
  token: z.string().min(1),
});

/**
 * Generate a cryptographically random token for invite links.
 */
function generateToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Create an invitation and return an invite link.
 * @knipignore
 */
export const createInvite = createServerFn({ method: "POST" })
  .inputValidator((data) => createInviteSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }): Promise<IdpInvitation> => {
    const userId = context.session?.user?.rowId;
    if (!userId) throw new Error("Unauthorized");

    const token = generateToken();
    const expiresAt = new Date(Date.now() + INVITE_TTL_MS).toISOString();

    const sdk = await getSdk();

    // Resolve org name for the invite email
    const { userOrganizations } = await sdk.OrganizationMembers({
      organizationId: data.organizationId,
    });
    const orgName = userOrganizations?.nodes?.[0]?.name ?? data.organizationId;

    const { createInvitation } = await sdk.CreateInvitation({
      input: {
        invitation: {
          organizationId: data.organizationId,
          inviterUserId: userId,
          email: data.email || null,
          role: data.role === "admin" ? MemberRole.Admin : MemberRole.Member,
          token,
          status: InvitationStatus.Pending,
          expiresAt: new Date(expiresAt),
        },
      },
    });

    const invitation = createInvitation?.invitation;
    if (!invitation) throw new Error("Failed to create invitation");

    const inviteLink = `${BASE_URL}/invite/${token}`;

    // Best-effort email notification when recipient email is provided
    if (data.email) {
      const inviterName =
        context.session?.user?.name ||
        context.session?.user?.email ||
        "A team member";

      await sendInviteEmail({
        recipientEmail: data.email,
        inviterName,
        workspaceName: orgName,
        inviteLink,
      });
    }

    return {
      id: invitation.rowId,
      organizationId: invitation.organizationId,
      email: invitation.email ?? "",
      role: invitation.role as string,
      status: "pending",
      expiresAt: String(invitation.expiresAt),
      inviterId: userId,
      inviteLink,
    } as IdpInvitation & { inviteLink: string };
  });

/**
 * Accept an invitation by token.
 * Validates the token, creates a userOrganization membership, and marks accepted.
 * @knipignore
 */
export const acceptInvite = createServerFn({ method: "POST" })
  .inputValidator((data) => acceptInviteSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const userId = context.session?.user?.rowId;
    if (!userId) throw new Error("Unauthorized");

    const sdk = await getSdk();

    // Look up the invitation by token
    const { invitations } = await sdk.InvitationByToken({
      token: data.token,
    });

    const invitation = invitations?.nodes?.[0];
    if (!invitation) throw new Error("Invalid invitation");
    if (invitation.status !== InvitationStatus.Pending)
      throw new Error("Invitation is no longer valid");

    // Check expiry
    if (new Date(invitation.expiresAt) < new Date()) {
      // Mark as expired
      await sdk.UpdateInvitation({
        input: {
          rowId: invitation.rowId,
          patch: { status: InvitationStatus.Expired },
        },
      });
      throw new Error("Invitation has expired");
    }

    // Resolve slug/name from an existing member of the organization
    const { userOrganizations: existingMembers } =
      await sdk.OrganizationMembers({
        organizationId: invitation.organizationId,
      });
    const existingSlug =
      existingMembers?.nodes?.[0]?.slug ?? invitation.organizationId;

    // Create membership for the accepting user
    await sdk.CreateUserOrganization({
      input: {
        userOrganization: {
          userId,
          organizationId: invitation.organizationId,
          slug: existingSlug,
          name: existingMembers?.nodes?.[0]?.name ?? null,
          type: OrganizationType.Team,
          role: invitation.role,
        },
      },
    });

    // Mark invitation as accepted
    await sdk.UpdateInvitation({
      input: {
        rowId: invitation.rowId,
        patch: { status: InvitationStatus.Accepted },
      },
    });

    return { organizationId: invitation.organizationId };
  });
