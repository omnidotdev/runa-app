import { GraphQLClient } from "graphql-request";
import * as jose from "jose";

import { getSdk } from "@/generated/graphql.sdk";
import { API_INTERNAL_GRAPHQL_URL } from "@/lib/config/env.config";

export type { OrganizationClaim } from "@omnidotdev/providers";

import type { OrganizationClaim } from "@omnidotdev/providers";

export const COOKIE_NAME = "runa_rowid_cache";
export const COOKIE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * Derive a key from a secret string using HKDF-SHA256.
 */
async function deriveKeyFromSecret(
  secret: string,
  salt: string,
  info: string,
): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
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

/**
 * Derive a key from `AUTH_SECRET` using HKDF.
 */
async function deriveKey(salt: string, info: string): Promise<Uint8Array> {
  const { AUTH_SECRET } = process.env;
  if (!AUTH_SECRET) throw new Error("AUTH_SECRET not configured");

  return deriveKeyFromSecret(AUTH_SECRET, salt, info);
}

async function getEncryptionKey(): Promise<Uint8Array> {
  return deriveKey("runa-rowid-cache", "encryption-key");
}

/** Claim key for organization claims - same as Gatekeeper */
export const OMNI_CLAIMS_ORGANIZATIONS =
  "https://manifold.omni.dev/@omni/claims/organizations";

/** Cached auth data stored in encrypted cookie */
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
 * Parse a decrypted JWE payload into CachedAuthData.
 */
function parseCachePayload(
  payload: jose.JWTDecryptResult["payload"],
): CachedAuthData | null {
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
}

/**
 * Decrypt the auth cache.
 * Tries current AUTH_SECRET first, falls back to AUTH_SECRET_PREVIOUS for rotation.
 */
export async function decryptCache(
  encryptedValue: string,
): Promise<CachedAuthData | null> {
  try {
    const key = await getEncryptionKey();
    const { payload } = await jose.jwtDecrypt(encryptedValue, key);

    return parseCachePayload(payload);
  } catch {
    // Try previous key for rotation support
    const { AUTH_SECRET_PREVIOUS } = process.env;
    if (!AUTH_SECRET_PREVIOUS) return null;

    try {
      const previousKey = await deriveKeyFromSecret(
        AUTH_SECRET_PREVIOUS,
        "runa-rowid-cache",
        "encryption-key",
      );
      const { payload } = await jose.jwtDecrypt(encryptedValue, previousKey);

      return parseCachePayload(payload);
    } catch {
      return null;
    }
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
