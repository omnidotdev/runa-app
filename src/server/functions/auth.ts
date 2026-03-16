import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest, setCookie } from "@tanstack/react-start/server";

import {
  AUTH_BASE_URL,
  AUTH_CLIENT_ID,
  BASE_URL,
} from "@/lib/config/env.config";

export const fetchSession = createServerFn().handler(async () => {
  const { getAuth } = await import("@/lib/auth/getAuth");
  const request = getRequest();

  const session = await getAuth(request);

  return { session };
});

const clearRowIdCacheCookie = async () => {
  const { authCache } = await import("@/lib/auth/authCache");
  setCookie(authCache.cookieName, "", { maxAge: 0, path: "/" });
};

/** @knipignore */
export const clearRowIdCache = createServerFn({ method: "POST" }).handler(
  async () => {
    await clearRowIdCacheCookie();
  },
);

export const signOutAndRedirect = createServerFn({ method: "POST" }).handler(
  async () => {
    const auth = (await import("@/lib/auth/auth")).default;
    const request = getRequest();

    await auth.api.signOut({ headers: request.headers });
    await clearRowIdCacheCookie();

    throw redirect({ to: "/" });
  },
);

/**
 * Build the IDP end_session URL for federated logout.
 */
export function getIdpLogoutUrl(): string | null {
  if (!AUTH_BASE_URL || !AUTH_CLIENT_ID || !BASE_URL) return null;

  const endSessionUrl = new URL(`${AUTH_BASE_URL}/oauth2/endsession`);
  endSessionUrl.searchParams.set("client_id", AUTH_CLIENT_ID);
  endSessionUrl.searchParams.set("post_logout_redirect_uri", BASE_URL);

  return endSessionUrl.toString();
}

/**
 * Sign out from the local session (server-side).
 * Returns the IDP logout URL for federated logout redirect.
 */
export const signOutLocal = createServerFn({ method: "POST" }).handler(
  async () => {
    const auth = (await import("@/lib/auth/auth")).default;
    const request = getRequest();

    await auth.api.signOut({ headers: request.headers });
    await clearRowIdCacheCookie();

    return { idpLogoutUrl: getIdpLogoutUrl() };
  },
);
