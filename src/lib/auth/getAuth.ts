import { setCookie } from "@tanstack/react-start/server";
import { all } from "better-all";
import * as jose from "jose";
import ms from "ms";

import auth from "@/lib/auth/auth";
import {
  COOKIE_NAME,
  COOKIE_TTL_SECONDS,
  OMNI_CLAIMS_ORGANIZATIONS,
  createSelfHostedToken,
  encryptAuthData,
  fetchRowIdFromApi,
  generateUuidV5,
  syncSelfHostedUser,
} from "@/lib/auth/rowIdCache";
import { AUTH_BASE_URL, isSelfHosted } from "@/lib/config/env.config";

import type { OrganizationClaim } from "@/lib/auth/rowIdCache";

/**
 * OIDC Discovery document structure.
 */
interface OIDCDiscovery {
  issuer: string;
  jwks_uri: string;
}

// Cache OIDC discovery and JWKS separately
let oidcDiscoveryCache: OIDCDiscovery | null = null;
let oidcDiscoveryCacheExpiry = 0;
let jwksCache: jose.JWTVerifyGetKey | null = null;
let jwksCacheExpiry = 0;

const OIDC_DISCOVERY_CACHE_TTL = ms("24h");
const JWKS_CACHE_TTL = ms("1h");

/**
 * Fetch OIDC discovery document.
 */
async function getOidcDiscovery(): Promise<OIDCDiscovery> {
  const now = Date.now();

  if (oidcDiscoveryCache && now < oidcDiscoveryCacheExpiry)
    return oidcDiscoveryCache;

  const discoveryUrl = new URL(
    "/.well-known/openid-configuration",
    AUTH_BASE_URL,
  );
  const response = await fetch(discoveryUrl, {
    signal: AbortSignal.timeout(15000), // 15 second timeout
  });

  if (!response.ok)
    throw new Error(
      `OIDC discovery failed: ${response.status} ${response.statusText}`,
    );

  const discovery = (await response.json()) as OIDCDiscovery;

  if (!discovery.issuer || !discovery.jwks_uri)
    throw new Error("Invalid OIDC discovery document");

  oidcDiscoveryCache = discovery;
  oidcDiscoveryCacheExpiry = now + OIDC_DISCOVERY_CACHE_TTL;

  return discovery;
}

/**
 * Get JWKS using OIDC discovery.
 */
async function getJwks(): Promise<jose.JWTVerifyGetKey> {
  const now = Date.now();

  if (jwksCache && now < jwksCacheExpiry) {
    return jwksCache;
  }

  const discovery = await getOidcDiscovery();
  jwksCache = jose.createRemoteJWKSet(new URL(discovery.jwks_uri), {
    timeoutDuration: 15000, // 15 seconds - longer timeout for cross-service calls
    cooldownDuration: 30000, // wait 30s before retrying after failure
  });
  jwksCacheExpiry = now + JWKS_CACHE_TTL;

  return jwksCache;
}

// Re-export from rowIdCache for backward compatibility
export type { OrganizationClaim } from "@/lib/auth/rowIdCache";

/**
 * Extract organization claims from a JWT payload.
 * Works for both HIDRA (SaaS) and self-hosted tokens - same claim structure.
 */
function extractOrganizations(payload: jose.JWTPayload): OrganizationClaim[] {
  const orgClaims = payload[OMNI_CLAIMS_ORGANIZATIONS];
  if (Array.isArray(orgClaims)) {
    return orgClaims as OrganizationClaim[];
  }
  return [];
}

export async function getAuth(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) return null;

    // These will be populated from JWT claims (same path for SaaS and self-hosted)
    let accessToken: string | undefined;
    let organizations: OrganizationClaim[] = [];
    // Cast to access custom session properties added by customSession plugin
    const customUser = session.user as typeof session.user & {
      identityProviderId?: string | null;
      rowId?: string | null;
      organizations?: OrganizationClaim[];
    };
    let identityProviderId = customUser.identityProviderId;
    let rowId = customUser.rowId;
    const cachedOrganizations = customUser.organizations;

    if (isSelfHosted) {
      // Self-hosted: generate JWT with org claims for API authentication
      if (!identityProviderId) {
        identityProviderId = await generateUuidV5(session.user.id);
      }

      // Check if we have complete cached data (avoids API call on every request)
      const hasCachedData =
        rowId && identityProviderId && cachedOrganizations?.length;

      if (hasCachedData) {
        // Cache hit: generate token locally without API sync
        organizations = cachedOrganizations;
        accessToken = await createSelfHostedToken({
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name || session.user.email,
            image: session.user.image,
          },
          organizations,
        });
      } else {
        // Cache miss: sync with API to get rowId and organizations
        try {
          const syncResult = await syncSelfHostedUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.name || session.user.email,
            image: session.user.image,
          });

          if (syncResult) {
            accessToken = syncResult.accessToken;
            if (!rowId) rowId = syncResult.rowId;
            identityProviderId = syncResult.identityProviderId;

            // Extract orgs from JWT
            const payload = jose.decodeJwt(accessToken);
            organizations = extractOrganizations(payload);

            // Cache auth data (rowId, identityProviderId, organizations)
            if (rowId && identityProviderId) {
              const encrypted = await encryptAuthData({
                rowId,
                identityProviderId,
                organizations,
              });
              setCookie(COOKIE_NAME, encrypted, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: COOKIE_TTL_SECONDS,
              });
            }
          }
        } catch (err) {
          console.error("[getAuth] Self-hosted sync error:", err);
        }
      }
    } else {
      // SaaS: get tokens from HIDRA via Better Auth
      try {
        const tokenResult = await auth.api.getAccessToken({
          body: { providerId: "omni" },
          headers: request.headers,
        });
        accessToken = tokenResult?.accessToken;

        // Extract claims from ID token (verified via JWKS)
        if (tokenResult?.idToken) {
          try {
            const { discovery, jwks } = await all({
              async discovery() {
                return getOidcDiscovery();
              },
              async jwks() {
                return getJwks();
              },
            });
            const { payload } = await jose.jwtVerify(
              tokenResult.idToken,
              jwks,
              {
                issuer: discovery.issuer,
              },
            );

            if (!identityProviderId) {
              identityProviderId = payload.sub ?? null;
            }

            // Extract orgs from JWT - SAME as self-hosted path above
            organizations = extractOrganizations(payload);
          } catch (jwtError) {
            console.error("[getAuth] JWT verification failed:", jwtError);
          }
        }

        // Handle rowId cache miss
        if (!rowId && accessToken && identityProviderId) {
          rowId =
            (await fetchRowIdFromApi(accessToken, identityProviderId)) ?? null;

          if (rowId) {
            const encrypted = await encryptAuthData({
              rowId,
              identityProviderId,
              organizations,
            });
            setCookie(COOKIE_NAME, encrypted, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
              maxAge: COOKIE_TTL_SECONDS,
            });
          }
        }
      } catch (err) {
        console.error("[getAuth] Token fetch error:", err);
      }
    }

    return {
      ...session,
      accessToken,
      organizations,
      user: {
        ...session.user,
        rowId,
        identityProviderId,
        username: session.user.name || session.user.email,
      },
    };
  } catch (error) {
    console.error("Failed to get auth session:", error);
    return null;
  }
}
