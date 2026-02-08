/**
 * IDP (Identity Provider) client for organization member management.
 *
 * SaaS: Fetches member data from the IDP (source of truth).
 * Self-hosted: Uses local GraphQL API for org management.
 */

import { AUTH_BASE_URL, isSelfHosted } from "@/lib/config/env.config";
import getSdk from "@/lib/graphql/getSdk";

import type { MemberRole } from "@/generated/graphql";

export interface IdpMember {
  id: string;
  userId: string;
  organizationId: string;
  role: "owner" | "admin" | "member";
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export interface IdpMembersResponse {
  data: IdpMember[];
}

/**
 * Fetch organization members.
 *
 * SaaS: Fetches from IDP (Gatekeeper).
 * Self-hosted: Fetches from local GraphQL API.
 */
export async function fetchOrganizationMembers(
  organizationId: string,
  accessToken: string,
): Promise<IdpMembersResponse> {
  if (isSelfHosted) {
    const sdk = await getSdk();
    const { userOrganizations } = await sdk.OrganizationMembers({
      organizationId,
    });

    const members: IdpMember[] =
      userOrganizations?.nodes?.map((node) => ({
        id: node.rowId,
        userId: node.user?.identityProviderId ?? "",
        organizationId: node.organizationId,
        role: node.role.toLowerCase() as "owner" | "admin" | "member",
        createdAt: String(node.createdAt),
        user: {
          id: node.user?.identityProviderId ?? "",
          name: node.user?.name ?? "",
          email: node.user?.email ?? "",
          image: node.user?.avatarUrl ?? null,
        },
      })) ?? [];

    return { data: members };
  }

  const url = new URL("/api/organization/members", AUTH_BASE_URL);
  url.searchParams.set("orgId", organizationId);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch organization members: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

export interface UpdateMemberRoleParams {
  organizationId: string;
  memberId: string;
  role: "owner" | "admin" | "member";
  accessToken: string;
}

/**
 * Update a member's role in the organization.
 *
 * SaaS: Updates via IDP (Gatekeeper).
 * Self-hosted: Updates via local GraphQL API.
 */
export async function updateMemberRole({
  organizationId,
  memberId,
  role,
  accessToken,
}: UpdateMemberRoleParams): Promise<IdpMember> {
  if (isSelfHosted) {
    const sdk = await getSdk();
    const { updateUserOrganization } = await sdk.UpdateUserOrganization({
      input: {
        rowId: memberId,
        patch: {
          role: role as MemberRole,
        },
      },
    });

    const org = updateUserOrganization?.userOrganization;
    if (!org) throw new Error("Failed to update member role");

    return {
      id: org.rowId,
      userId: "",
      organizationId: org.organizationId,
      role: org.role.toLowerCase() as "owner" | "admin" | "member",
      createdAt: new Date().toISOString(),
      user: { id: "", name: "", email: "", image: null },
    };
  }

  const url = new URL("/api/organization/members", AUTH_BASE_URL);
  url.searchParams.set("orgId", organizationId);
  url.searchParams.set("memberId", memberId);

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update member role: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

export interface RemoveMemberParams {
  organizationId: string;
  memberId: string;
  accessToken: string;
}

/**
 * Remove a member from the organization.
 *
 * SaaS: Removes via IDP (Gatekeeper).
 * Self-hosted: Removes via local GraphQL API.
 */
export async function removeMember({
  organizationId,
  memberId,
  accessToken,
}: RemoveMemberParams): Promise<void> {
  if (isSelfHosted) {
    const sdk = await getSdk();
    await sdk.DeleteUserOrganization({ rowId: memberId });
    return;
  }

  const url = new URL("/api/organization/members", AUTH_BASE_URL);
  url.searchParams.set("orgId", organizationId);
  url.searchParams.set("memberId", memberId);

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to remove member: ${response.status} ${response.statusText}`,
    );
  }
}

export interface InviteMemberParams {
  organizationId: string;
  email: string;
  role: "admin" | "member";
  accessToken: string;
}

export interface IdpInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: string;
  status: "pending" | "accepted" | "rejected" | "canceled";
  expiresAt: string;
  inviterId: string;
}

/**
 * Invite a member to the organization.
 *
 * SaaS: Invites via IDP (Gatekeeper).
 * Self-hosted: Creates invitation via local API (Phase 6b).
 */
export async function inviteMember({
  organizationId,
  email,
  role,
  accessToken,
}: InviteMemberParams): Promise<IdpInvitation> {
  if (isSelfHosted) {
    // Self-hosted invite flow handled by invitation server functions (Phase 6b)
    const { createInvite } = await import("@/server/functions/invitations");
    return createInvite({ data: { organizationId, email, role } });
  }

  const url = new URL("/api/auth/organization/invite-member", AUTH_BASE_URL);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      organizationId,
      email,
      role,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message ||
        `Failed to invite member: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}
