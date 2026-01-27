import { getCookie } from "@tanstack/react-start/server";
import { betterAuth } from "better-auth";
import { customSession, genericOAuth } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { COOKIE_NAME, decryptCache } from "@/lib/auth/rowIdCache";
import {
  AUTH_BASE_URL,
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
  BASE_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  OIDC_CLIENT_ID,
  OIDC_CLIENT_SECRET,
  OIDC_ISSUER,
} from "@/lib/config/env.config";
import { pgPool } from "@/lib/db";

const { AUTH_SECRET } = process.env;

// Build genericOAuth config array based on available credentials
const oauthConfigs: Parameters<typeof genericOAuth>[0]["config"] = [];

// Omni/Gatekeeper OAuth (SaaS mode)
if (AUTH_CLIENT_ID && AUTH_CLIENT_SECRET && AUTH_BASE_URL) {
  oauthConfigs.push({
    providerId: "omni",
    clientId: AUTH_CLIENT_ID,
    clientSecret: AUTH_CLIENT_SECRET,
    discoveryUrl: `${AUTH_BASE_URL}/.well-known/openid-configuration`,
    scopes: ["openid", "profile", "email", "offline_access", "organization"],
    accessType: "offline",
    pkce: true,
    mapProfileToUser: (profile) => ({
      name: profile.name,
      email: profile.email,
      emailVerified: profile.email_verified,
      image: profile.picture,
    }),
  });
}

// Google OAuth
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  oauthConfigs.push({
    providerId: "google",
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    discoveryUrl:
      "https://accounts.google.com/.well-known/openid-configuration",
    scopes: ["openid", "profile", "email"],
    pkce: true,
    mapProfileToUser: (profile) => ({
      name: profile.name,
      email: profile.email,
      emailVerified: profile.email_verified,
      image: profile.picture,
    }),
  });
}

// GitHub OAuth
if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET) {
  oauthConfigs.push({
    providerId: "github",
    clientId: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    authorizationUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    userInfoUrl: "https://api.github.com/user",
    scopes: ["user:email", "read:user"],
    mapProfileToUser: (profile) => ({
      name: profile.name || profile.login,
      email: profile.email,
      emailVerified: true,
      image: profile.avatar_url,
    }),
  });
}

// Generic OIDC (enterprise SSO)
if (OIDC_ISSUER && OIDC_CLIENT_ID && OIDC_CLIENT_SECRET) {
  oauthConfigs.push({
    providerId: "oidc",
    clientId: OIDC_CLIENT_ID,
    clientSecret: OIDC_CLIENT_SECRET,
    discoveryUrl: `${OIDC_ISSUER}/.well-known/openid-configuration`,
    scopes: ["openid", "profile", "email"],
    pkce: true,
    mapProfileToUser: (profile) => ({
      name: profile.name,
      email: profile.email,
      emailVerified: profile.email_verified,
      image: profile.picture,
    }),
  });
}

// Build plugins array
const plugins = [];

if (oauthConfigs.length > 0) {
  plugins.push(genericOAuth({ config: oauthConfigs }));
}

plugins.push(
  customSession(async ({ user, session }) => {
    // Try to get rowId and identityProviderId from cache.
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
);

/**
 * Whether running in SaaS mode (Omni OAuth configured).
 * SaaS mode is stateless - no database, no email/password.
 */
const isSaaSMode = !!AUTH_CLIENT_ID;

/**
 * Auth server client.
 */
const auth = betterAuth({
  baseURL: BASE_URL,
  basePath: "/api/auth",
  secret: AUTH_SECRET,
  // Trust the app's own origin for auth requests
  trustedOrigins: BASE_URL ? [BASE_URL] : [],
  // Database for self-hosted mode only (email/password auth)
  // SaaS mode stays stateless - no database connection
  ...(pgPool && {
    database: pgPool,
  }),
  // Use prefixed tables to avoid collision with app's user table
  // These tables are only used in self-hosted mode with email/password
  user: {
    modelName: "ba_user",
  },
  session: {
    modelName: "ba_session",
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
    modelName: "ba_account",
    // store OAuth tokens in a signed cookie for stateless mode
    storeAccountCookie: true,
  },
  verification: {
    modelName: "ba_verification",
  },
  // Email/password enabled only in self-hosted mode with database
  emailAndPassword: {
    enabled: !isSaaSMode && !!pgPool,
  },
  advanced: {
    // use custom cookie prefix to avoid collision with IDP cookies
    cookiePrefix: "runa",
  },
  plugins,
});

export default auth;
