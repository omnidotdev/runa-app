// core
const NODE_ENV = process.env.NODE_ENV;
export const API_GRAPHQL_URL = process.env.NEXT_PUBLIC_API_GRAPHQL_URL;

// environment helpers
/** @knipignore */
export const isDevEnv = NODE_ENV === "development";
