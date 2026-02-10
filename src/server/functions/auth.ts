import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest, setCookie } from "@tanstack/react-start/server";

import auth from "@/lib/auth/auth";
import { getAuth } from "@/lib/auth/getAuth";
import { COOKIE_NAME } from "@/lib/auth/rowIdCache";
import {
  AUTH_BASE_URL,
  AUTH_CLIENT_ID,
  BASE_URL,
} from "@/lib/config/env.config";

export const fetchSession = createServerFn().handler(async () => {
  const request = getRequest();

  const session = await getAuth(request);

  return { session };
});

const clearRowIdCacheCookie = () => {
  setCookie(COOKIE_NAME, "", { maxAge: 0, path: "/" });
};

/** @knipignore */
export const clearRowIdCache = createServerFn({ method: "POST" }).handler(
  async () => {
    clearRowIdCacheCookie();
  },
);

export const signOutAndRedirect = createServerFn({ method: "POST" }).handler(
  async () => {
    const request = getRequest();

    await auth.api.signOut({ headers: request.headers });
    clearRowIdCacheCookie();

    throw redirect({ to: "/" });
  },
);

/**
 * Build the IDP end_session URL for federated logout
 */
export function getIdpLogoutUrl(): string | null {
  if (!AUTH_BASE_URL || !AUTH_CLIENT_ID) return null;

  const endSessionUrl = new URL(`${AUTH_BASE_URL}/oauth2/endsession`);
  endSessionUrl.searchParams.set("client_id", AUTH_CLIENT_ID);
  endSessionUrl.searchParams.set("post_logout_redirect_uri", BASE_URL);

  return endSessionUrl.toString();
}

/**
 * Sign out from the local session (server-side)
 * Returns the IDP logout URL for federated logout redirect
 */
export const signOutLocal = createServerFn({ method: "POST" }).handler(
  async () => {
    const request = getRequest();

    await auth.api.signOut({ headers: request.headers });
    clearRowIdCacheCookie();

    return { idpLogoutUrl: getIdpLogoutUrl() };
  },
);
