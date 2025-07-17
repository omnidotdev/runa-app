import { GraphQLClient } from "graphql-request";

import { getSdk } from "@/generated/graphql.sdk";
import {
  API_GRAPHQL_URL,
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
  AUTH_ISSUER,
  isDevEnv,
} from "@/lib/config/env.config";

import type { AuthConfig } from "@auth/core";
import type { CookieOption } from "@auth/core/types";

declare module "@auth/core/jwt" {
  interface JWT extends DefaultJWT {
    sub?: string;
    row_id?: string;
    preferred_username?: string;
    given_name?: string;
    family_name?: string;
    access_token: string;
    expires_at: number;
    refresh_token: string;
    error?: "RefreshTokenError";
  }
}

declare module "@auth/core/types" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    expires: Date;
    user: {
      rowId?: string;
      hidraId?: string;
      username?: string;
    } & DefaultUser;
    error?: "RefreshTokenError";
  }
}

/**
 * Shared cookie options required for cross-domain cookie processing flows. Without these, authentication breaks.
 */
const cookieOptions: Pick<CookieOption, "options"> = {
  options: {
    sameSite: "none",
  },
};

const authOptions: AuthConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  basePath: "/api/auth",
  debug: isDevEnv,
  cookies: {
    sessionToken: cookieOptions,
    state: cookieOptions,
    pkceCodeVerifier: cookieOptions,
  },
  providers: [
    {
      // hint encryption algorithms from IDP; currently not correctly broadcast by Better Auth (https://github.com/better-auth/better-auth/pull/2326)
      client: {
        // TODO research security of these, they are from Better Auth, maybe tweakable if needed. Research quantum resistance
        authorization_signed_response_alg: "HS256",
        id_token_signed_response_alg: "HS256",
      },
      id: "omni",
      name: "Omni",
      type: "oidc",
      issuer: AUTH_ISSUER,
      clientId: AUTH_CLIENT_ID,
      clientSecret: AUTH_CLIENT_SECRET,
      checks: ["pkce", "state"],
      authorization: {
        params: {
          scope: "openid profile email offline_access",
          prompt: "consent",
        },
      },
    },
  ],
  callbacks: {
    jwt: async ({ token, profile, account }) => {
      if (account) {
        token.sub = profile?.sub!;
        token.preferred_username = profile?.preferred_username!;
        token.given_name = profile?.given_name!;
        token.family_name = profile?.family_name!;
        token.access_token = account.access_token!;
        token.expires_at = account.expires_at!;
        token.refresh_token = account.refresh_token!;

        const graphqlClient = new GraphQLClient(API_GRAPHQL_URL!, {
          headers: {
            Authorization: `Bearer ${account.access_token}`,
          },
        });

        const sdk = getSdk(graphqlClient);

        const { userByIdentityProviderId } = await sdk.UserByIdentityProviderId(
          { hidraId: token.sub },
        );

        token.row_id = userByIdentityProviderId?.rowId;

        return token;
      }

      // TODO: refresh rotation

      return token;
    },
    session: async ({ session, token }) => {
      session.user.hidraId = token.sub;
      session.user.rowId = token.row_id;
      session.user.username = token.preferred_username;
      session.accessToken = token.access_token;
      session.refreshToken = token.refresh_token;
      session.expires = new Date(token.expires_at * 1000);
      session.error = token.error;

      return session;
    },
  },
};

export default authOptions;
