// core
export const API_GRAPHQL_URL = import.meta.env.VITE_API_GRAPHQL_URL;
export const BASE_URL = import.meta.env.VITE_BASE_URL;

// auth
export const AUTH_ISSUER = import.meta.env.VITE_AUTH_ISSUER;
export const AUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID;
export const AUTH_CLIENT_SECRET = process.env.AUTH_CLIENT_SECRET;

// environment helpers
export const isDevEnv = import.meta.env.DEV;
