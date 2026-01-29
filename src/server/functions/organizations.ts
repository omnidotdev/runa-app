import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

import { AUTH_BASE_URL, isSelfHosted } from "@/lib/config/env.config";
import getSdk from "@/lib/graphql/getSdk";
import { authMiddleware } from "@/server/middleware";

const createOrganizationSchema = z.object({
  name: z.string().min(3, "Organization name must be at least 3 characters"),
  slug: z.string().optional(),
});

const getOrganizationBySlugSchema = z.object({
  slug: z.string().min(1),
});

/**
 * Generate a URL-safe slug from a name.
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

/**
 * Create a new organization in Gatekeeper (IDP).
 * This allows RPs to create organizations on behalf of users.
 * @knipignore
 */
export const createOrganization = createServerFn({ method: "POST" })
  .inputValidator((data) => createOrganizationSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data }) => {
    // Self-hosted: team workspaces not yet supported
    // TODO(self-hosted): Implement local team workspace creation
    if (isSelfHosted) {
      throw new Error(
        "Team workspace creation is not available in self-hosted mode.",
      );
    }

    const slug = data.slug || generateSlug(data.name);
    const request = getRequest();

    // Forward cookies to Gatekeeper for session-based auth
    // (The OAuth access token is for RP-to-API calls, not IDP calls)
    const cookieHeader = request.headers.get("cookie") || "";

    const response = await fetch(`${AUTH_BASE_URL}/organization/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
        // Use Gatekeeper's own origin for server-to-server calls
        Origin: AUTH_BASE_URL!,
      },
      body: JSON.stringify({
        name: data.name,
        slug,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[createOrganization] Failed: ${response.status} ${response.statusText}`,
        errorText,
      );
      let errorMessage = "Failed to create organization";
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const organization = await response.json();

    return organization as {
      id: string;
      name: string;
      slug: string;
      type: "personal" | "team";
      createdAt: string;
    };
  });

export type Organization = {
  id: string;
  name: string;
  slug: string;
  type: "personal" | "team";
  createdAt: string;
};

/**
 * Get an organization by slug.
 * Used when JWT claims are stale and don't include a newly created org.
 *
 * SaaS: Fetches from Gatekeeper (IDP).
 * Self-hosted: Queries API for user's orgs and finds by slug.
 */
export const getOrganizationBySlug = createServerFn({ method: "GET" })
  .inputValidator((data) => getOrganizationBySlugSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    if (isSelfHosted) {
      // Query API for user's organizations to handle stale JWT cache
      try {
        const identityProviderId = context.session?.user?.identityProviderId;
        if (!identityProviderId) return null;

        const sdk = await getSdk();
        const { userByIdentityProviderId } = await sdk.UserByIdentityProviderId(
          { identityProviderId },
        );

        const org = userByIdentityProviderId?.userOrganizations?.nodes?.find(
          (o) => o.slug === data.slug,
        );

        if (!org) return null;

        return {
          id: org.organizationId,
          name: org.name ?? data.slug,
          slug: org.slug,
          type: org.type as "personal" | "team",
          createdAt: new Date().toISOString(),
        } as Organization;
      } catch (error) {
        console.error(
          "[getOrganizationBySlug] Self-hosted lookup failed:",
          error,
        );
        return null;
      }
    }

    const request = getRequest();
    const cookieHeader = request.headers.get("cookie") || "";

    const response = await fetch(
      `${AUTH_BASE_URL}/organization/get-full-organization?query=${encodeURIComponent(JSON.stringify({ slug: data.slug }))}`,
      {
        method: "GET",
        headers: {
          Cookie: cookieHeader,
          Origin: AUTH_BASE_URL!,
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const organization = await response.json();
    return organization as Organization | null;
  });
