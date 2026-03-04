import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { AUTH_BASE_URL } from "@/lib/config/env.config";
import { authMiddleware } from "@/server/middleware";

import type { IdpInvitation } from "@/lib/idp";

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
 * Create a new organization via Gatekeeper.
 * @knipignore
 */
export const createOrganization = createServerFn({ method: "POST" })
  .inputValidator((data) => createOrganizationSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const slug = data.slug || generateSlug(data.name);
    const accessToken = context.session.accessToken;

    if (!accessToken) {
      throw new Error("No access token available");
    }

    // Use Bearer auth — Gatekeeper's oidcAccessTokenPlugin resolves
    // opaque access tokens to authenticated sessions
    const response = await fetch(`${AUTH_BASE_URL}/organization/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
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

      if (response.status === 401) {
        throw new Error(
          "Session expired. Please sign out and sign back in to re-authenticate.",
        );
      }

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

const inviteOrganizationMemberSchema = z.object({
  organizationId: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "member"]),
});

/**
 * Invite a member to an organization via Gatekeeper.
 * Runs server-side to avoid CORS issues with the IDP's Better Auth endpoint.
 */
export const inviteOrganizationMember = createServerFn({ method: "POST" })
  .inputValidator((data) => inviteOrganizationMemberSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const accessToken = context.session.accessToken;

    if (!accessToken) {
      throw new Error("No access token available");
    }

    // biome-ignore lint/suspicious/noConsole: diagnostic logging for token resolution
    console.debug(
      `[inviteOrganizationMember] Token: length=${accessToken.length}, hasDots=${accessToken.includes(".")}`,
    );

    // Use Bearer auth — Gatekeeper's oidcAccessTokenPlugin resolves
    // opaque access tokens to authenticated sessions
    const response = await fetch(
      `${AUTH_BASE_URL}/organization/invite-member`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Origin: AUTH_BASE_URL!,
        },
        body: JSON.stringify({
          organizationId: data.organizationId,
          email: data.email,
          role: data.role,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[inviteOrganizationMember] Failed: ${response.status} ${response.statusText}`,
        errorText,
      );

      if (response.status === 401) {
        throw new Error(
          "Session expired. Please sign out and sign back in to re-authenticate.",
        );
      }

      let errorMessage = "Failed to invite member";
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  });

const listOrganizationInvitationsSchema = z.object({
  organizationId: z.string(),
});

/**
 * List invitations for an organization via Gatekeeper.
 * Runs server-side to avoid CORS issues with the IDP's Better Auth endpoint.
 */
export const listOrganizationInvitations = createServerFn({ method: "GET" })
  .inputValidator((data) => listOrganizationInvitationsSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const accessToken = context.session.accessToken;

    if (!accessToken) {
      throw new Error("No access token available");
    }

    const response = await fetch(
      `${AUTH_BASE_URL}/organization/list-invitations?query=${encodeURIComponent(JSON.stringify({ organizationId: data.organizationId }))}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Origin: AUTH_BASE_URL!,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[listOrganizationInvitations] Failed: ${response.status} ${response.statusText}`,
        errorText,
      );

      if (response.status === 401) {
        throw new Error(
          "Session expired. Please sign out and sign back in to re-authenticate.",
        );
      }

      let errorMessage = "Failed to list invitations";
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json() as Promise<IdpInvitation[]>;
  });

const cancelOrganizationInvitationSchema = z.object({
  invitationId: z.string(),
});

/**
 * Cancel an organization invitation via Gatekeeper.
 * Runs server-side to avoid CORS issues with the IDP's Better Auth endpoint.
 */
export const cancelOrganizationInvitation = createServerFn({ method: "POST" })
  .inputValidator((data) => cancelOrganizationInvitationSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const accessToken = context.session.accessToken;

    if (!accessToken) {
      throw new Error("No access token available");
    }

    const response = await fetch(
      `${AUTH_BASE_URL}/organization/cancel-invitation`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Origin: AUTH_BASE_URL!,
        },
        body: JSON.stringify({
          invitationId: data.invitationId,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[cancelOrganizationInvitation] Failed: ${response.status} ${response.statusText}`,
        errorText,
      );

      if (response.status === 401) {
        throw new Error(
          "Session expired. Please sign out and sign back in to re-authenticate.",
        );
      }

      let errorMessage = "Failed to cancel invitation";
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.message || error.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  });

/**
 * Get an organization by slug.
 * Used when JWT claims are stale and don't include a newly created org.
 */
export const getOrganizationBySlug = createServerFn({ method: "GET" })
  .inputValidator((data) => getOrganizationBySlugSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const accessToken = context.session.accessToken;

    if (!accessToken) {
      return null;
    }

    // Use Bearer auth — Gatekeeper's oidcAccessTokenPlugin resolves
    // opaque access tokens to authenticated sessions
    const response = await fetch(
      `${AUTH_BASE_URL}/organization/get-full-organization?query=${encodeURIComponent(JSON.stringify({ slug: data.slug }))}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
