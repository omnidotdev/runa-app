import { useCallback } from "react";

import signIn from "@/lib/auth/signIn";
import { BASE_URL } from "@/lib/config/env.config";
import { signOutLocal } from "@/server/functions/auth";

/**
 * Re-authenticate a degraded session (the Better Auth session is still valid,
 * only the OAuth refresh-token family is dead).
 *
 * Signing in with an active session just bounces back through the callback
 * without re-authorizing, so the local session (and row-id cache) is cleared
 * first to force the OAuth redirect and mint a fresh token family. The caller
 * lands back on `redirectTo` (its current location by default) once a fresh
 * token is in hand.
 */
const useReAuth = (redirectTo?: string) =>
  useCallback(async () => {
    try {
      await signOutLocal();
    } catch {
      // Proceed with re-auth even if local sign-out fails.
    }

    const redirectUrl =
      redirectTo ??
      (typeof window !== "undefined"
        ? window.location.href
        : `${BASE_URL}/workspaces`);

    await signIn({ redirectUrl, providerId: "omni" });
  }, [redirectTo]);

export default useReAuth;
