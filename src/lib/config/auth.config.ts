import {
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
  AUTH_ISSUER,
} from "@/lib/config/env.config";

import type { AuthConfig } from "@auth/core";

const authOptions: AuthConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  basePath: "/api/auth",
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
};

export default authOptions;
