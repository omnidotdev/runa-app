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
export const BILLING_BASE_URL = clientEnv.BILLING_BASE_URL;
export const CONSOLE_URL = env.CONSOLE_URL || env.VITE_CONSOLE_URL;

// Auth: Omni/Gatekeeper
export const AUTH_BASE_URL = env.AUTH_BASE_URL || env.VITE_AUTH_BASE_URL;
export const AUTH_CLIENT_ID = env.AUTH_CLIENT_ID;
export const AUTH_CLIENT_SECRET = env.AUTH_CLIENT_SECRET;

// Internal auth URL for server-to-server communication (Docker service name)
// Falls back to AUTH_BASE_URL for non-Docker environments
export const AUTH_INTERNAL_URL =
  typeof window === "undefined"
    ? process.env.AUTH_INTERNAL_URL || AUTH_BASE_URL
    : AUTH_BASE_URL;

// Feature flags
export const FLAGS_API_HOST = env.FLAGS_API_HOST || env.VITE_FLAGS_API_HOST;
export const FLAGS_CLIENT_KEY =
  env.FLAGS_CLIENT_KEY || env.VITE_FLAGS_CLIENT_KEY;

export const API_GRAPHQL_URL = `${API_BASE_URL}/graphql`;

// Internal GraphQL URL for server-side requests
export const API_INTERNAL_GRAPHQL_URL = `${API_INTERNAL_URL}/graphql`;

// Environment helpers
/** @knipignore */
export const isDevEnv = import.meta.env.DEV;
/** @knipignore */
export const isProdEnv = import.meta.env.PROD;

/** Whether billing (Aether) is available */
export const hasBilling = !!BILLING_BASE_URL;

// Startup warnings for optional integrations
if (!BILLING_BASE_URL)
  console.warn("BILLING_BASE_URL not set, billing disabled");
if (!FLAGS_API_HOST)
  console.warn("FLAGS_API_HOST not set, feature flags disabled");
if (!CONSOLE_URL) console.warn("CONSOLE_URL not set, console link disabled");
