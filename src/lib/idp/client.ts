/**
 * IDP (Identity Provider) client for organization member management.
 * Delegates to GatekeeperOrgClient (source of truth)
 */

import gatekeeperOrg from "@/lib/config/gatekeeper";

import type { GatekeeperMember } from "@omnidotdev/providers/auth";

// Backwards-compatible type aliases
export type IdpMember = GatekeeperMember;
export type IdpMembersResponse = { data: IdpMember[] };

export type UpdateMemberRoleParams = {
  organizationId: string;
  memberId: string;
  role: "owner" | "admin" | "member";
  accessToken: string;
};

export type RemoveMemberParams = {
  organizationId: string;
  memberId: string;
  accessToken: string;
};

/**
 * Fetch organization members from Gatekeeper
 */
export async function fetchOrganizationMembers(
  organizationId: string,
  accessToken: string,
): Promise<IdpMembersResponse> {
  return gatekeeperOrg.listMembers(organizationId, accessToken);
}

/**
 * Update a member's role in the organization via Gatekeeper
 */
export async function updateMemberRole({
  organizationId,
  memberId,
  role,
  accessToken,
}: UpdateMemberRoleParams): Promise<IdpMember> {
  return gatekeeperOrg.updateMemberRole(
    { organizationId, memberId, role },
    accessToken,
  );
}

/**
 * Remove a member from the organization via Gatekeeper
 */
export async function removeMember({
  organizationId,
  memberId,
  accessToken,
}: RemoveMemberParams): Promise<void> {
  return gatekeeperOrg.removeMember({ organizationId, memberId }, accessToken);
}
