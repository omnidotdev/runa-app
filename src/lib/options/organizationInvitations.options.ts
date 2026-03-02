/**
 * Query options for organization invitations from IDP.
 */

import { queryOptions } from "@tanstack/react-query";

import { listOrganizationInvitations } from "@/server/functions/organizations";

export interface OrganizationInvitationsVariables {
  organizationId: string;
}

/**
 * Query options for fetching pending organization invitations.
 */
const organizationInvitationsOptions = ({
  organizationId,
}: OrganizationInvitationsVariables) =>
  queryOptions({
    queryKey: ["organizationInvitations", organizationId],
    queryFn: async () => {
      const invitations = await listOrganizationInvitations({
        data: { organizationId },
      });

      return invitations.filter(
        (invitation) => invitation.status === "pending",
      );
    },
    enabled: !!organizationId,
  });

export default organizationInvitationsOptions;
