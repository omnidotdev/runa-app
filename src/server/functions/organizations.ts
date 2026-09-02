import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import gatekeeperOrg from "@/lib/config/gatekeeper";
import { authMiddleware } from "@/server/middleware";

export type { GatekeeperOrganization as Organization } from "@omnidotdev/providers/auth";

const createOrganizationSchema = z.object({
  name: z.string().min(3, "Organization name must be at least 3 characters"),
  slug: z.string().optional(),
});

const getOrganizationBySlugSchema = z.object({
  slug: z.string().min(1),
});

/**
 * Create a new organization via Gatekeeper.
 * @knipignore
 */
export const createOrganization = createServerFn({ method: "POST" })
  .inputValidator((data) => createOrganizationSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const accessToken = context.session.accessToken;

    if (!accessToken) {
      throw new Error("No access token available");
    }

    return gatekeeperOrg.createOrganization(data, accessToken);
  });

const checkWorkspaceHandleSchema = z.object({
  slug: z.string().min(1),
});

/**
 * Check whether a workspace handle (slug) is available across the ecosystem
 * namespace. Backs live validation in the create-workspace form. Public
 * check, so no auth middleware
 * @knipignore
 */
export const checkWorkspaceHandleAvailability = createServerFn({
  method: "GET",
})
  .inputValidator((data) => checkWorkspaceHandleSchema.parse(data))
  .handler(async ({ data }) => {
    return gatekeeperOrg.checkNamespaceAvailability(data.slug);
  });

/**
 * Get an organization by slug.
 * Used when JWT claims are stale and don't include a newly created org
 */
export const getOrganizationBySlug = createServerFn({ method: "GET" })
  .inputValidator((data) => getOrganizationBySlugSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const accessToken = context.session.accessToken;

    if (!accessToken) {
      return null;
    }

    return gatekeeperOrg.getOrganizationBySlug(data.slug, accessToken);
  });

/**
 * Fetch an organization by slug without authentication.
 * Used for public board access when no JWT is available
 */
export const fetchOrganizationBySlug = createServerFn()
  .inputValidator((data) => getOrganizationBySlugSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      return await gatekeeperOrg.fetchOrganizationBySlug(data.slug);
    } catch (error) {
      console.error("Error fetching organization by slug:", error);
      return null;
    }
  });
