/**
 * Hook to get the current user's role for an organization.
 *
 * Since membership is now managed by the IDP (Gatekeeper), roles come from
 * the organization claims in the JWT token, not from local database queries.
 */

import { useOrganization } from "@/providers/OrganizationProvider";

import type { Role } from "@/lib/permissions";

/**
 * Get the current user's role for a specific organization.
 *
 * @param organizationId - The organization ID to check the role for
 * @returns The user's role in the organization, or undefined if not found
 */
export function useCurrentUserRole(
  organizationId: string | undefined,
): Role | undefined {
  const orgContext = useOrganization();

  if (!organizationId || !orgContext) return undefined;

  const org = orgContext.getOrganizationById(organizationId);
  if (!org) return undefined;

  // The roles array contains the user's roles in this org
  // Priority: owner > admin > member
  if (org.roles.includes("owner")) return "owner";
  if (org.roles.includes("admin")) return "admin";
  if (org.roles.includes("member")) return "member";

  // Default to member if they have access but no explicit role
  return "member";
}
