/**
 * Query options for organization members from IDP.
 *
 * The IDP (Gatekeeper) is the single source of truth for org membership. The
 * member endpoint is server-to-server (service token), so the fetch is routed
 * through a server function rather than called directly from the client.
 */

import { queryOptions } from "@tanstack/react-query";

import { listOrganizationMembers } from "@/server/functions/organizations";

export interface OrganizationMembersVariables {
  organizationId: string;
  accessToken: string;
}

/**
 * Query options for fetching organization members from IDP.
 */
const organizationMembersOptions = ({
  organizationId,
  accessToken,
}: OrganizationMembersVariables) =>
  queryOptions({
    queryKey: ["organizationMembers", organizationId],
    queryFn: () => listOrganizationMembers({ data: { organizationId } }),
    enabled: !!organizationId && !!accessToken,
  });

export default organizationMembersOptions;
