/**
 * Environment variables.
 *
 * Runtime env vars (process.env) override build-time vars (import.meta.env).
 */
const env = { ...import.meta.env, ...process.env };

// Core URLs
export const BASE_URL = env.BASE_URL || env.VITE_BASE_URL;
export const API_BASE_URL = env.API_BASE_URL || env.VITE_API_BASE_URL;
export const BILLING_BASE_URL =
  env.BILLING_BASE_URL || env.VITE_BILLING_BASE_URL;

// Self-hosted flag
export const VITE_SELF_HOSTED = env.VITE_SELF_HOSTED;
export const SELF_HOSTED = env.SELF_HOSTED;

// Auth: Omni/Gatekeeper (SaaS)
export const AUTH_BASE_URL = env.AUTH_BASE_URL || env.VITE_AUTH_BASE_URL;
export const AUTH_CLIENT_ID = env.AUTH_CLIENT_ID;
export const AUTH_CLIENT_SECRET = env.AUTH_CLIENT_SECRET;

// Auth: Google OAuth
export const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;

// Auth: GitHub OAuth
export const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = env.GITHUB_CLIENT_SECRET;

// Auth: Generic OIDC (enterprise SSO)
export const OIDC_ISSUER = env.OIDC_ISSUER;
export const OIDC_CLIENT_ID = env.OIDC_CLIENT_ID;
export const OIDC_CLIENT_SECRET = env.OIDC_CLIENT_SECRET;

// Feature flags
export const FLAGS_API_HOST = env.FLAGS_API_HOST || env.VITE_FLAGS_API_HOST;
export const FLAGS_CLIENT_KEY =
  env.FLAGS_CLIENT_KEY || env.VITE_FLAGS_CLIENT_KEY;

export const API_GRAPHQL_URL = `${API_BASE_URL}/graphql`;

// environment helpers
/** @knipignore */
export const isDevEnv = import.meta.env.DEV;
/** @knipignore */
export const isProdEnv = import.meta.env.PROD;
/** @knipignore */
export const isSelfHosted =
  SELF_HOSTED === "true" || VITE_SELF_HOSTED === "true";

/**
 * Billing provider to use.
 * - "local" for self-hosted (all features unlocked)
 * - "aether" for SaaS (billing service)
 */
export const billingProvider: "local" | "aether" = isSelfHosted
  ? "local"
  : "aether";
