/**
 * IDP (Identity Provider) client for organization member management.
 * Fetches member data from Gatekeeper (source of truth).
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
  data: IdpMember[];
}

/**
 * Fetch organization members from Gatekeeper.
 */
export async function fetchOrganizationMembers(
  organizationId: string,
  accessToken: string,
): Promise<IdpMembersResponse> {
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
 * Update a member's role in the organization via Gatekeeper.
 */
export async function updateMemberRole({
  organizationId,
  memberId,
  role,
  accessToken,
}: UpdateMemberRoleParams): Promise<IdpMember> {
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
 * Remove a member from the organization via Gatekeeper.
 */
export async function removeMember({
  organizationId,
  memberId,
  accessToken,
}: RemoveMemberParams): Promise<void> {
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
