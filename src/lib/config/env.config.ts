// core
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_GRAPHQL_URL = import.meta.env.VITE_API_GRAPHQL_URL;
export const BASE_URL = import.meta.env.VITE_BASE_URL;

// auth
export const AUTH_ISSUER = import.meta.env.VITE_AUTH_ISSUER;
export const AUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID;
export const AUTH_CLIENT_SECRET = process.env.AUTH_CLIENT_SECRET;

// payment processing
export const POLAR_ACCESS_TOKEN = process.env.POLAR_ACCESS_TOKEN;
export const enablePolarSandbox =
  import.meta.env.VITE_ENABLE_POLAR_SANDBOX === "true";

// environment helpers
export const isDevEnv = import.meta.env.DEV;
