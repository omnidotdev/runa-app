/**
 * Client-safe environment variables injected at runtime.
 *
 * These are injected into the HTML as `window.__ENV__` by the server,
 * allowing runtime configuration without rebuilding the app.
 */

/** Public env vars safe to expose to the client */
type ClientEnv = {
  BASE_URL?: string;
  API_BASE_URL?: string;
};

declare global {
  interface Window {
    __ENV__?: ClientEnv;
  }
}

/**
 * Get client env from window.__ENV__ (browser) or process.env (server).
 * Falls back to build-time VITE_* values if runtime values aren't set.
 */
const getClientEnv = (): Required<ClientEnv> => {
  // Server-side: read from process.env
  if (typeof window === "undefined") {
    return {
      BASE_URL: process.env.BASE_URL || import.meta.env.VITE_BASE_URL || "",
      API_BASE_URL:
        process.env.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || "",
    };
  }

  // Client-side: read from injected window.__ENV__, fall back to build-time vars
  return {
    BASE_URL: window.__ENV__?.BASE_URL || import.meta.env.VITE_BASE_URL || "",
    API_BASE_URL:
      window.__ENV__?.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || "",
  };
};

export type { ClientEnv };
export default getClientEnv;
