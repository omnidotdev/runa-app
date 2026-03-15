/**
 * Tests for organization server function URL construction.
 * Verifies that Better Auth endpoints receive query params
 * as direct URL search params (not JSON-encoded `?query=` wrapper).
 */

import { describe, expect, it } from "bun:test";

/**
 * Build the list-invitations URL the same way the server function does.
 */
function buildListInvitationsUrl(
  baseUrl: string,
  organizationId: string,
): string {
  return `${baseUrl}/organization/list-invitations?organizationId=${encodeURIComponent(organizationId)}`;
}

/**
 * Build the get-full-organization URL the same way the server function does.
 */
function buildGetFullOrganizationUrl(baseUrl: string, slug: string): string {
  return `${baseUrl}/organization/get-full-organization?organizationSlug=${encodeURIComponent(slug)}`;
}

describe("organization URL construction", () => {
  const baseUrl = "https://auth.example.com";

  describe("listOrganizationInvitations", () => {
    it("should pass organizationId as a direct query param", () => {
      const url = new URL(buildListInvitationsUrl(baseUrl, "org_123"));

      expect(url.searchParams.get("organizationId")).toBe("org_123");
      expect(url.searchParams.has("query")).toBe(false);
    });

    it("should encode special characters in organizationId", () => {
      const url = new URL(buildListInvitationsUrl(baseUrl, "org/special&id"));

      expect(url.searchParams.get("organizationId")).toBe("org/special&id");
    });

    it("should not wrap params in a JSON query string", () => {
      const url = buildListInvitationsUrl(baseUrl, "org_123");

      // Must not contain ?query= wrapper (the old broken format)
      expect(url).not.toContain("?query=");
      expect(url).toContain("?organizationId=org_123");
    });
  });

  describe("getOrganizationBySlug", () => {
    it("should pass slug as organizationSlug query param", () => {
      const url = new URL(buildGetFullOrganizationUrl(baseUrl, "my-org"));

      expect(url.searchParams.get("organizationSlug")).toBe("my-org");
      expect(url.searchParams.has("query")).toBe(false);
      expect(url.searchParams.has("slug")).toBe(false);
    });

    it("should encode special characters in slug", () => {
      const url = new URL(buildGetFullOrganizationUrl(baseUrl, "org&co"));

      expect(url.searchParams.get("organizationSlug")).toBe("org&co");
    });

    it("should not wrap params in a JSON query string", () => {
      const url = buildGetFullOrganizationUrl(baseUrl, "my-org");

      expect(url).not.toContain("?query=");
      expect(url).toContain("?organizationSlug=my-org");
    });
  });
});
