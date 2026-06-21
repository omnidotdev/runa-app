/**
 * Query options for organization members from IDP.
 *
 * The IDP is the single source of truth for organization membership. The fetch
 * runs through a server function (getOrganizationMembers) because Gatekeeper's
 * members endpoint is gated on a server-to-server service token that must never
 * reach the browser.
 */

import { queryOptions } from "@tanstack/react-query";

import { getOrganizationMembers } from "@/server/functions/organizationMembers";

export interface OrganizationMembersVariables {
  organizationId: string;
}

/**
 * Query options for fetching organization members from IDP.
 */
const organizationMembersOptions = ({
  organizationId,
}: OrganizationMembersVariables) =>
  queryOptions({
    queryKey: ["organizationMembers", organizationId],
    queryFn: () => getOrganizationMembers({ data: { organizationId } }),
    enabled: !!organizationId,
  });

export default organizationMembersOptions;
