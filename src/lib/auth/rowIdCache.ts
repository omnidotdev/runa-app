import { GraphQLClient } from "graphql-request";
import * as jose from "jose";

import { getSdk } from "@/generated/graphql.sdk";
import { API_GRAPHQL_URL } from "@/lib/config/env.config";

export const COOKIE_NAME = "runa_rowid_cache";
export const COOKIE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

async function getEncryptionKey(): Promise<Uint8Array> {
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
        salt: encoder.encode("runa-rowid-cache"),
        info: encoder.encode("encryption-key"),
      },
      keyMaterial,
      256,
    ),
  );
}

export async function encryptRowId(
  rowId: string,
  identityProviderId: string,
): Promise<string> {
  const key = await getEncryptionKey();

  return new jose.EncryptJWT({ rowId, identityProviderId })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_TTL_SECONDS}s`)
    .encrypt(key);
}

export interface CachedRowIdData {
  rowId: string;
  identityProviderId: string;
}

/**
 * Decrypt the cache and return both rowId and identityProviderId.
 * The identityProviderId in the cache is the IDP's sub claim (not Better Auth's user.id).
 */
export async function decryptCache(
  encryptedValue: string,
): Promise<CachedRowIdData | null> {
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
    const graphqlClient = new GraphQLClient(API_GRAPHQL_URL!, {
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
