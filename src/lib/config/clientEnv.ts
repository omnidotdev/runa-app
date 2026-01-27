/**
 * Client-safe environment variables injected at runtime.
 *
 * These are injected into the HTML as `window.__ENV__` by the server,
 * allowing runtime configuration without rebuilding the app.
 *
 * For self-hosted deployments, set these env vars on the server:
 * - BASE_URL: Your app's public URL (e.g., https://runa.example.com)
 * - API_BASE_URL: Your API's public URL (e.g., https://api.runa.example.com)
 * - SELF_HOSTED: Set to "true" for self-hosted mode
 */

/** Public env vars safe to expose to the client. */
type ClientEnv = {
  BASE_URL?: string;
  API_BASE_URL?: string;
  SELF_HOSTED?: string;
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
      SELF_HOSTED:
        process.env.SELF_HOSTED || import.meta.env.VITE_SELF_HOSTED || "",
    };
  }

  // Client-side: read from injected window.__ENV__, fall back to build-time vars
  return {
    BASE_URL: window.__ENV__?.BASE_URL || import.meta.env.VITE_BASE_URL || "",
    API_BASE_URL:
      window.__ENV__?.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || "",
    SELF_HOSTED:
      window.__ENV__?.SELF_HOSTED || import.meta.env.VITE_SELF_HOSTED || "",
  };
};

export type { ClientEnv };
export default getClientEnv;
