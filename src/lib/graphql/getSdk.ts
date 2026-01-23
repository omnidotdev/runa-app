import { getSdk as getGeneratedSdk } from "@/generated/graphql.sdk";
import { getGraphQLClient } from "@/lib/graphql/graphqlClientFactory";
import { fetchSession } from "@/server/functions/auth";

import type { SdkFunctionWrapper } from "@/generated/graphql.sdk";

/**
 * Wrapper that injects fresh auth headers into each SDK request.
 * Fetches the access token via server function to ensure it's never stale.
 */
const authWrapper: SdkFunctionWrapper = async (action) => {
  const { session } = await fetchSession();
  const accessToken = session?.accessToken;

  return action(
    accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  );
};

/**
 * Get the GraphQL SDK with fresh auth headers per request.
 *
 * Uses the singleton GraphQL client and injects auth headers via wrapper,
 * ensuring the token is never stale after idle periods.
 *
 * Returns a Promise for backward compatibility with existing `await getSdk()` calls.
 */
const getSdk = async () => getGeneratedSdk(getGraphQLClient(), authWrapper);

export default getSdk;
