/**
 * IDP (Identity Provider) client for organization member management.
 *
 * Fetches member data from the IDP instead of the local database.
 * The IDP is the single source of truth for organization membership.
 */

import { AUTH_BASE_URL } from "@/lib/config/env.config";

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
  members: IdpMember[];
  total: number;
}

/**
 * Fetch organization members from IDP.
 */
export async function fetchOrganizationMembers(
  organizationId: string,
  accessToken: string,
): Promise<IdpMembersResponse> {
  const url = new URL(
    `/api/organization/${organizationId}/members`,
    AUTH_BASE_URL,
  );

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
 * Update a member's role in the organization via IDP.
 */
export async function updateMemberRole({
  organizationId,
  memberId,
  role,
  accessToken,
}: UpdateMemberRoleParams): Promise<IdpMember> {
  const url = new URL(
    `/api/organization/${organizationId}/members/${memberId}`,
    AUTH_BASE_URL,
  );

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
 * Remove a member from the organization via IDP.
 */
export async function removeMember({
  organizationId,
  memberId,
  accessToken,
}: RemoveMemberParams): Promise<void> {
  const url = new URL(
    `/api/organization/${organizationId}/members/${memberId}`,
    AUTH_BASE_URL,
  );

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
 * Invite a member to the organization via IDP.
 */
export async function inviteMember({
  organizationId,
  email,
  role,
  accessToken,
}: InviteMemberParams): Promise<IdpInvitation> {
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
