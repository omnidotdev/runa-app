// core
const NODE_ENV = process.env.NODE_ENV;
export const NEXT_RUNTIME = process.env.NEXT_RUNTIME;
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const API_GRAPHQL_URL = process.env.NEXT_PUBLIC_API_GRAPHQL_URL;

// environment helpers
export const isDevEnv = NODE_ENV === "development";
