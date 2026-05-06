import { createGetAuth } from "@omnidotdev/providers/auth";
import { setCookie } from "@tanstack/react-start/server";

import { getSdk as getGeneratedSdk } from "@/generated/graphql.sdk";
import auth from "@/lib/auth/auth";
import { authCache, oidc } from "@/lib/auth/authCache";
import { getGraphQLClient } from "@/lib/graphql/graphqlClientFactory";

import type { ResolveRowIdFn } from "@omnidotdev/providers/auth";

export type {
  GetAuthSession,
  OrganizationClaim,
} from "@omnidotdev/providers/auth";

/**
 * Resolve the runa-api `user.rowId` UUID for the authenticated caller. Better
 * Auth's `user.id` is a 32-char base64 string and fails the runa-api `UUID`
 * scalar; the canonical row UUID lives in runa-api and is exposed via the
 * `observer` query.
 */
const resolveRowId: ResolveRowIdFn = async ({ accessToken }) => {
  const sdk = getGeneratedSdk(getGraphQLClient(), async (action) =>
    action({ Authorization: `Bearer ${accessToken}` }),
  );
  const { observer } = await sdk.Observer();

  return observer?.rowId ?? null;
};

const getAuth = createGetAuth({
  authApi: auth.api,
  oidc,
  authCache,
  setCookie,
  resolveRowId,
});

export { getAuth };
