import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { ORG_SYNC_SERVICE_TOKEN } from "@/lib/config/env.config";
import gatekeeperOrg from "@/lib/config/gatekeeper";
import { authMiddleware } from "@/server/middleware";

import type { IdpMembersResponse } from "@/lib/idp";

const organizationSchema = z.object({
  organizationId: z.string().min(1),
});

/**
 * List an organization's members, server-side.
 *
 * Gatekeeper's members endpoint is gated on ORG_SYNC_SERVICE_TOKEN, a
 * server-to-server credential, so the read must run on the server where the
 * secret lives and never in the browser. The caller is authorized by checking
 * the authenticated session is itself a member of the requested organization,
 * so the service token cannot be used to enumerate arbitrary orgs' members.
 */
export const getOrganizationMembers = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => organizationSchema.parse(data))
  .handler(async ({ data, context }): Promise<IdpMembersResponse> => {
    const { organizationId } = data;

    const isMember = context.session.organizations?.some(
      (org) => org.id === organizationId,
    );
    if (!isMember) {
      throw new Error("Forbidden: not a member of this organization");
    }

    if (!ORG_SYNC_SERVICE_TOKEN) {
      throw new Error("ORG_SYNC_SERVICE_TOKEN not configured");
    }

    return gatekeeperOrg.listMembers(organizationId, ORG_SYNC_SERVICE_TOKEN);
  });
