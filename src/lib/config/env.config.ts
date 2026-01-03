/**
 * Environment variables.
 */
export const {
  // core
  VITE_BASE_URL: BASE_URL,
  VITE_API_BASE_URL: API_BASE_URL,
  VITE_AUTH_BASE_URL: AUTH_BASE_URL,
  VITE_BILLING_BASE_URL: BILLING_BASE_URL,
  // auth (server-side secrets)
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET,
  // emails
  VITE_FROM_EMAIL_ADDRESS: FROM_EMAIL_ADDRESS,
  VITE_TO_EMAIL_ADDRESS: TO_EMAIL_ADDRESS,
} = { ...import.meta.env, ...process.env };

export const API_GRAPHQL_URL = `${API_BASE_URL}/graphql`;

// environment helpers
/** @knipignore TODO remove ignore when this is inevitably used */
export const isDevEnv = import.meta.env.DEV;
