import { getCookie } from "@tanstack/react-start/server";
import { betterAuth } from "better-auth";
import { customSession, genericOAuth } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { authCache } from "@/lib/auth/authCache";
import {
  AUTH_BASE_URL,
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
  AUTH_INTERNAL_URL,
  BASE_URL,
} from "@/lib/config/env.config";

import type { OrganizationClaim } from "@omnidotdev/providers/auth";

const { AUTH_SECRET } = process.env;

// Build genericOAuth config array based on available credentials
const oauthConfigs: Parameters<typeof genericOAuth>[0]["config"] = [];

// Omni/Gatekeeper OAuth
if (AUTH_CLIENT_ID && AUTH_CLIENT_SECRET && AUTH_BASE_URL) {
  oauthConfigs.push({
    providerId: "omni",
    clientId: AUTH_CLIENT_ID,
    clientSecret: AUTH_CLIENT_SECRET,
    discoveryUrl: `${AUTH_INTERNAL_URL}/.well-known/openid-configuration`,
    scopes: ["openid", "profile", "email", "offline_access", "organization"],
    accessType: "offline",
    pkce: true,
    prompt: "login",
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
    // Try to get cached auth data (rowId, identityProviderId, organizations)
    let rowId: string | null = null;
    let identityProviderId: string | null = null;
    let organizations: OrganizationClaim[] = [];

    const cachedValue = getCookie(authCache.cookieName);
    if (cachedValue) {
      const cached = await authCache.decrypt(cachedValue);
      if (cached) {
        rowId = cached.rowId;
        identityProviderId = cached.identityProviderId;
        organizations = cached.organizations;
      }
    }

    // If cache miss, getAuth() will sync with the API and populate the cache

    return {
      user: {
        ...user,
        rowId,
        identityProviderId,
        organizations,
      },
      session,
    };
  }),
  // NB: must be the last plugin in the array
  tanstackStartCookies(),
);

/**
 * Auth server client.
 */
const auth = betterAuth({
  baseURL: BASE_URL,
  basePath: "/api/auth",
  secret: AUTH_SECRET,
  // Trust the app's own origin for auth requests
  trustedOrigins: BASE_URL ? [BASE_URL] : [],
  session: {
    // Extend session expiration to 30 days
    expiresIn: 60 * 60 * 24 * 30,
    // Refresh session if older than 1 day
    updateAge: 60 * 60 * 24,
    // Enable cookie caching for stateless session validation
    cookieCache: {
      enabled: true,
      // Match session expiration so OAuth tokens (stored in account_data cookie
      // with the same maxAge) don't expire before the session itself
      maxAge: 60 * 60 * 24 * 30,
      // Use encrypted JWE for security
      strategy: "jwe",
      // Auto-refresh cookie before expiry
      refreshCache: true,
    },
  },
  account: {
    // Store OAuth tokens in a signed cookie for stateless mode
    storeAccountCookie: true,
  },
  emailAndPassword: {
    enabled: false,
  },
  advanced: {
    // Use custom cookie prefix to avoid collision with IDP cookies
    cookiePrefix: "runa",
  },
  plugins,
});

export default auth;
