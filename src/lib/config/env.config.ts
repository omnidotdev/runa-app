// core
const NODE_ENV = process.env.NODE_ENV;
const APP_ENV = process.env.APP_ENV;
export const NEXT_RUNTIME = process.env.NEXT_RUNTIME;
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const API_GRAPHQL_URL = process.env.NEXT_PUBLIC_API_GRAPHQL_URL;

// environment helpers
export const isDevEnv = NODE_ENV === "development";
// NB: `APP_ENV` is used instead of `NODE_ENV` because `next dev` shadows `NODE_ENV`, so even if `NODE_ENV=test` is injected into the environment, it will be overwritten to "development". See https://github.com/vercel/next.js/issues/17032
const isTestEnv = APP_ENV === "test";
