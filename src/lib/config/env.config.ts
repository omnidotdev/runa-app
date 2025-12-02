// core
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_GRAPHQL_URL = `${API_BASE_URL}/graphql`;
export const BASE_URL = import.meta.env.VITE_BASE_URL;

// auth
// TODO: switch to base path (https://linear.app/omnidev/issue/OMNI-254/move-apiauth-paths-to-base-path-or-subpath-eg-auth)
export const AUTH_ISSUER = `${import.meta.env.VITE_AUTH_BASE_URL}/api/auth`;
export const AUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID;
export const AUTH_CLIENT_SECRET = process.env.AUTH_CLIENT_SECRET;

// payment processing
export const STRIPE_PORTAL_CONFIG_ID = import.meta.env
  .VITE_STRIPE_PORTAL_CONFIG_ID;

// environment helpers
export const isDevEnv = import.meta.env.DEV;
