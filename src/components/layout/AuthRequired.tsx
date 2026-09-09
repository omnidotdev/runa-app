import { Loader2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Logo } from "@/components/core";
import { Button } from "@/components/ui/button";
import signIn from "@/lib/auth/signIn";

interface Props {
  /**
   * Absolute URL to return to after authentication. Defaults to the current
   * location, which suits an in-place handoff (the visitor stays on the page
   * that needs auth); the sign-in route passes the originally requested URL.
   */
  redirectTo?: string;
}

/**
 * Sign-in handoff for surfaces that are not viewable while logged out (private
 * or nonexistent projects/tasks). The visitor may still have access once
 * authenticated, so instead of a 404 we start the OAuth flow and return them to
 * `redirectTo` afterward.
 *
 * Sign-in is client-only (`authClient.signIn.social` performs the redirect), so
 * the handoff runs from an effect: on SSR and first paint this shows the
 * redirecting state, then the browser navigates to the identity provider. The
 * manual button covers the case where the automatic redirect fails.
 */
const AuthRequired = ({ redirectTo }: Props) => {
  const [failed, setFailed] = useState(false);

  const startSignIn = useCallback(
    () =>
      signIn({
        redirectUrl: redirectTo ?? window.location.href,
        providerId: "omni",
      }).catch((error) => {
        console.error("[AuthRequired] sign-in redirect failed:", error);
        setFailed(true);
      }),
    [redirectTo],
  );

  useEffect(() => {
    startSignIn();
  }, [startSignIn]);

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4 p-6 text-center">
      <Logo className="size-10 text-primary-500" />

      {failed ? (
        <>
          <p className="text-base-600 text-sm dark:text-base-400">
            Sign in to view this page.
          </p>
          <Button
            onClick={startSignIn}
            className="bg-primary-500 text-base-950 hover:bg-primary-400 dark:bg-primary-500 dark:hover:bg-primary-400"
          >
            Sign In
          </Button>
        </>
      ) : (
        <p className="flex items-center gap-2 text-base-600 text-sm dark:text-base-400">
          <Loader2Icon className="size-4 animate-spin" />
          Redirecting to sign in...
        </p>
      )}
    </div>
  );
};

export default AuthRequired;
