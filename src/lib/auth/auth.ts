import { getCookie } from "@tanstack/react-start/server";
import { betterAuth } from "better-auth/minimal";
import { customSession, genericOAuth } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { COOKIE_NAME, decryptCache } from "@/lib/auth/rowIdCache";
import {
  AUTH_BASE_URL,
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
  BASE_URL,
} from "@/lib/config/env.config";

const { AUTH_SECRET } = process.env;

/**
 * Auth server client.
 */
const auth = betterAuth({
  baseURL: BASE_URL,
  basePath: "/api/auth",
  secret: AUTH_SECRET,
  advanced: {
    // use custom cookie prefix to avoid collision with IDP cookies
    cookiePrefix: "runa",
  },
  session: {
    // extend session expiration to 30 days
    expiresIn: 60 * 60 * 24 * 30,
    // refresh session if older than 1 day
    updateAge: 60 * 60 * 24,
    // enable cookie caching for stateless session validation
    cookieCache: {
      enabled: true,
      // cache session in cookie for 7 days
      maxAge: 60 * 60 * 24 * 7,
      // use encrypted JWE for security
      strategy: "jwe",
      // auto-refresh cookie before expiry (critical for stateless mode)
      refreshCache: true,
    },
  },
  account: {
    // store OAuth tokens (access token, refresh token) in a signed cookie for stateless mode to enable automatic token refresh without a database
    storeAccountCookie: true,
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "omni",
          clientId: AUTH_CLIENT_ID,
          clientSecret: AUTH_CLIENT_SECRET,
          discoveryUrl: `${AUTH_BASE_URL}/.well-known/openid-configuration`,
          scopes: [
            "openid",
            "profile",
            "email",
            "offline_access",
            "organization",
          ],
          accessType: "offline",
          pkce: true,
          // Map OIDC standard claims to Better Auth user fields
          // TODO: Check if BA genericOAuth should auto-map `picture` → `image` by default
          mapProfileToUser: (profile) => ({
            name: profile.name,
            email: profile.email,
            emailVerified: profile.email_verified,
            image: profile.picture,
          }),
        },
      ],
    }),
    customSession(async ({ user, session }) => {
      // Try to get rowId and identityProviderId from cache
      // The identityProviderId (IDP sub) is stored in the cache and extracted
      // from the ID token in getAuth().
      let rowId: string | null = null;
      let identityProviderId: string | null = null;

      const cachedValue = getCookie(COOKIE_NAME);
      if (cachedValue) {
        const cached = await decryptCache(cachedValue);
        if (cached) {
          rowId = cached.rowId;
          identityProviderId = cached.identityProviderId;
        }
      }

      // If cache miss, rowId and identityProviderId will be null.
      // The getAuth() function will handle fetching from the API and
      // populating the cache when it has access to the ID token.

      return {
        user: {
          ...user,
          rowId,
          identityProviderId,
        },
        session,
      };
    }),
    // NB: must be the last plugin in the array
    tanstackStartCookies(),
  ],
});

export default auth;
