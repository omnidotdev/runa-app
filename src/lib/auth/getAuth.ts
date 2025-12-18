import { GraphQLClient } from "graphql-request";
import { createRemoteJWKSet, jwtVerify } from "jose";

import { getSdk } from "@/generated/graphql.sdk";
import auth from "@/lib/auth/auth";
import { API_GRAPHQL_URL, AUTH_ISSUER_URL } from "@/lib/config/env.config";

const OMNI_CLAIMS_KEY = "https://manifold.omni.dev/@omni/claims/organizations";

export interface OrganizationClaim {
  id: string;
  slug: string;
  roles: string[];
  teams: Array<{ id: string; name: string }>;
}

export async function getAuth(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) return null;

    // get access token and id token for GraphQL requests
    let accessToken: string | undefined;
    let identityProviderId: string | undefined;
    let organizations: OrganizationClaim[] | undefined;

    try {
      const tokenResult = await auth.api.getAccessToken({
        body: { providerId: "omni" },
        headers: request.headers,
      });
      accessToken = tokenResult?.accessToken;

      // extract claims from the ID token
      if (tokenResult?.idToken) {
        const jwks = createRemoteJWKSet(new URL(`${AUTH_ISSUER_URL}/jwks`));
        const { payload } = await jwtVerify(tokenResult.idToken, jwks);
        identityProviderId = payload.sub;

        // extract organization claims from the ID token
        const orgClaims = payload[OMNI_CLAIMS_KEY];
        if (Array.isArray(orgClaims)) {
          organizations = orgClaims as OrganizationClaim[];
        }
      }
    } catch (err) {
      console.error(err);
    }

    let rowId: string | undefined;

    // fetch the database `rowId` using the IDP ID (`identityProviderId` from `idToken.sub`)
    if (accessToken && identityProviderId) {
      try {
        const graphqlClient = new GraphQLClient(API_GRAPHQL_URL!, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const sdk = getSdk(graphqlClient);

        const { userByIdentityProviderId } = await sdk.UserByIdentityProviderId(
          {
            identityProviderId,
          },
        );

        if (userByIdentityProviderId) rowId = userByIdentityProviderId.rowId;
      } catch (error) {
        console.error(
          "[getAuth] Error fetching user rowId from GraphQL:",
          error,
        );
      }
    }

    const result = {
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

    return result;
  } catch (error) {
    console.error("Failed to get auth session:", error);
    return null;
  }
}
