/**
 * Environment variables.
 *
 * For self-hosted deployments, set these runtime env vars (without VITE_ prefix):
 * - BASE_URL: Your app's public URL (e.g., https://runa.example.com)
 * - API_BASE_URL: Your API's public URL (e.g., https://api.runa.example.com)
 * - SELF_HOSTED: Set to "true" for self-hosted mode
 *
 * These are injected into the client via window.__ENV__ at runtime.
 * See clientEnv.ts for implementation details.
 */
import getClientEnv from "./clientEnv";

const env = { ...import.meta.env, ...process.env };
const clientEnv = getClientEnv();

// Core URLs (injected at runtime for client, read from process.env for server)
export const BASE_URL = clientEnv.BASE_URL;
export const API_BASE_URL = clientEnv.API_BASE_URL;

// Internal API URL for server-to-server communication (Docker service name)
// Falls back to API_BASE_URL for non-Docker environments
export const API_INTERNAL_URL =
  typeof window === "undefined"
    ? process.env.API_INTERNAL_URL || clientEnv.API_BASE_URL
    : clientEnv.API_BASE_URL;
export const BILLING_BASE_URL =
  env.BILLING_BASE_URL || env.VITE_BILLING_BASE_URL;

// Self-hosted flag
export const SELF_HOSTED = clientEnv.SELF_HOSTED;

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

// Internal GraphQL URL for server-side requests
export const API_INTERNAL_GRAPHQL_URL = `${API_INTERNAL_URL}/graphql`;

// environment helpers
/** @knipignore */
export const isDevEnv = import.meta.env.DEV;
/** @knipignore */
export const isProdEnv = import.meta.env.PROD;
/** @knipignore */
export const isSelfHosted = SELF_HOSTED === "true";

/**
 * Billing provider to use.
 * - "local" for self-hosted (all features unlocked)
 * - "aether" for SaaS (billing service)
 */
export const billingProvider: "local" | "aether" = isSelfHosted
  ? "local"
  : "aether";
