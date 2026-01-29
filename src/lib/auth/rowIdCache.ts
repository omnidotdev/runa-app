import { GraphQLClient } from "graphql-request";
import * as jose from "jose";

import { getSdk } from "@/generated/graphql.sdk";
import { API_INTERNAL_GRAPHQL_URL } from "@/lib/config/env.config";

export const COOKIE_NAME = "runa_rowid_cache";
export const COOKIE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * Derive a key from `AUTH_SECRET` using HKDF.
 */
async function deriveKey(salt: string, info: string): Promise<Uint8Array> {
  const { AUTH_SECRET } = process.env;
  if (!AUTH_SECRET) throw new Error("AUTH_SECRET not configured");

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(AUTH_SECRET),
    "HKDF",
    false,
    ["deriveBits"],
  );

  return new Uint8Array(
    await crypto.subtle.deriveBits(
      {
        name: "HKDF",
        hash: "SHA-256",
        salt: encoder.encode(salt),
        info: encoder.encode(info),
      },
      keyMaterial,
      256,
    ),
  );
}

async function getEncryptionKey(): Promise<Uint8Array> {
  return deriveKey("runa-rowid-cache", "encryption-key");
}

/**
 * Get signing key for self-hosted JWTs.
 * Must match the API's key derivation.
 */
async function getSelfHostedSigningKey(): Promise<Uint8Array> {
  return deriveKey("runa-self-hosted-auth", "jwt-signing-key");
}

interface SelfHostedUserInfo {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

/** Organization claim structure - matches HIDRA Gatekeeper format. */
export interface OrganizationClaim {
  id: string;
  name: string;
  slug: string;
  type: "personal" | "team";
  roles: string[];
  teams: Array<{ id: string; name: string }>;
}

/** Result of syncing a self-hosted user. */
export interface SyncSelfHostedUserResult {
  rowId: string;
  accessToken: string;
  identityProviderId: string;
}

/** Claim key for organization claims - same as HIDRA Gatekeeper. */
export const OMNI_CLAIMS_ORGANIZATIONS =
  "https://manifold.omni.dev/@omni/claims/organizations";

// Namespace UUID for generating deterministic UUIDs from Better Auth IDs
const SELF_HOSTED_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

/**
 * Generate a deterministic UUID v5 from a string.
 * Uses SHA-1 hash to create a reproducible UUID from namespace + name.
 */
export async function generateUuidV5(name: string): Promise<string> {
  const encoder = new TextEncoder();

  // Parse namespace UUID to bytes
  const namespaceBytes = new Uint8Array(16);
  const hex = SELF_HOSTED_NAMESPACE.replace(/-/g, "");
  for (let i = 0; i < 16; i++) {
    namespaceBytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }

  // Concatenate namespace + name
  const nameBytes = encoder.encode(name);
  const data = new Uint8Array(namespaceBytes.length + nameBytes.length);
  data.set(namespaceBytes);
  data.set(nameBytes, namespaceBytes.length);

  // SHA-1 hash
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = new Uint8Array(hashBuffer);

  // Set version (5) and variant bits
  hashArray[6] = (hashArray[6] & 0x0f) | 0x50;
  hashArray[8] = (hashArray[8] & 0x3f) | 0x80;

  // Format as UUID string
  const hexStr = Array.from(hashArray.slice(0, 16))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${hexStr.slice(0, 8)}-${hexStr.slice(8, 12)}-${hexStr.slice(12, 16)}-${hexStr.slice(16, 20)}-${hexStr.slice(20, 32)}`;
}

interface CreateSelfHostedTokenParams {
  user: SelfHostedUserInfo;
  organizations?: OrganizationClaim[];
}

/**
 * Create a self-hosted JWT for API authentication.
 * Embeds organization claims in the same format as HIDRA Gatekeeper,
 * enabling a single code path for org extraction in getAuth().
 */
export async function createSelfHostedToken({
  user,
  organizations = [],
}: CreateSelfHostedTokenParams): Promise<string> {
  const key = await getSelfHostedSigningKey();

  // Generate deterministic UUID from Better Auth user ID
  const identityProviderId = await generateUuidV5(user.id);

  return new jose.SignJWT({
    sub: identityProviderId,
    email: user.email,
    name: user.name,
    picture: user.image,
    // Embed orgs using same claim key as HIDRA - enables unified extraction
    [OMNI_CLAIMS_ORGANIZATIONS]: organizations,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("self-hosted")
    .setExpirationTime("8h")
    .sign(key);
}

/**
 * Sync user to API and return access token with embedded org claims.
 * The API will create the user and provision personal workspace if needed.
 *
 * Returns a JWT with organization claims in the same format as HIDRA,
 * enabling a single code path for org extraction in getAuth().
 *
 * @param user - User info from Better Auth session.
 */
export async function syncSelfHostedUser(
  user: SelfHostedUserInfo,
): Promise<SyncSelfHostedUserResult | null> {
  try {
    const identityProviderId = await generateUuidV5(user.id);

    // Create initial token (no orgs) to authenticate API request
    const initialToken = await createSelfHostedToken({ user });

    // Use internal URL for server-to-server communication in Docker
    const graphqlClient = new GraphQLClient(API_INTERNAL_GRAPHQL_URL!, {
      headers: { Authorization: `Bearer ${initialToken}` },
    });
    const sdk = getSdk(graphqlClient);

    // The API's authentication plugin will upsert the user from the JWT claims
    // and auto-provision a personal workspace if none exists.
    // We query for the user to get the `rowId` and organizations back.
    const { userByIdentityProviderId } = await sdk.UserByIdentityProviderId({
      identityProviderId,
    });

    if (!userByIdentityProviderId?.rowId) {
      return null;
    }

    // Transform API organization data to OrganizationClaim format (matches HIDRA)
    const organizations: OrganizationClaim[] =
      userByIdentityProviderId.userOrganizations?.nodes?.map((org) => ({
        id: org.organizationId,
        slug: org.slug,
        name: org.name ?? `${user.name}'s Workspace`,
        type: org.type as "personal" | "team",
        roles: [org.role],
        teams: [], // Self-hosted doesn't support teams yet
      })) ?? [];

    // Create final token WITH org claims embedded (same format as HIDRA)
    const accessToken = await createSelfHostedToken({ user, organizations });

    return {
      rowId: userByIdentityProviderId.rowId,
      accessToken,
      identityProviderId,
    };
  } catch (error) {
    console.error("[rowIdCache] Failed to sync self-hosted user:", error);
    return null;
  }
}

/** Cached auth data stored in encrypted cookie. */
export interface CachedAuthData {
  rowId: string;
  identityProviderId: string;
  organizations: OrganizationClaim[];
}

/**
 * Encrypt auth data for cookie storage.
 * Caches rowId, identityProviderId, and organizations to avoid API calls.
 */
export async function encryptAuthData(data: CachedAuthData): Promise<string> {
  const key = await getEncryptionKey();

  return new jose.EncryptJWT({
    rowId: data.rowId,
    identityProviderId: data.identityProviderId,
    organizations: data.organizations,
  })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_TTL_SECONDS}s`)
    .encrypt(key);
}

/**
 * Decrypt the auth cache.
 * Returns rowId, identityProviderId, and organizations.
 */
export async function decryptCache(
  encryptedValue: string,
): Promise<CachedAuthData | null> {
  try {
    const key = await getEncryptionKey();
    const { payload } = await jose.jwtDecrypt(encryptedValue, key);

    if (
      typeof payload.rowId !== "string" ||
      typeof payload.identityProviderId !== "string"
    ) {
      return null;
    }

    return {
      rowId: payload.rowId,
      identityProviderId: payload.identityProviderId,
      organizations: Array.isArray(payload.organizations)
        ? (payload.organizations as OrganizationClaim[])
        : [],
    };
  } catch {
    return null;
  }
}

/**
 * Fetch rowId from GraphQL API.
 */
export async function fetchRowIdFromApi(
  accessToken: string,
  identityProviderId: string,
): Promise<string | null> {
  try {
    // Use internal URL for server-to-server communication in Docker
    const graphqlClient = new GraphQLClient(API_INTERNAL_GRAPHQL_URL!, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const sdk = getSdk(graphqlClient);
    const { userByIdentityProviderId } = await sdk.UserByIdentityProviderId({
      identityProviderId,
    });
    return userByIdentityProviderId?.rowId ?? null;
  } catch (error) {
    console.error("[rowIdCache] Failed to fetch rowId:", error);
    return null;
  }
}
