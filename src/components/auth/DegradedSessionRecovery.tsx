import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "@/components/core";
import { Button } from "@/components/ui/button";
import {
  markReauthAttempt,
  reauthRecentlyAttempted,
} from "@/lib/auth/reauthGuard";
import useReAuth from "@/lib/auth/useReAuth";

interface Props {
  /**
   * Absolute URL to return to once a fresh token family is in hand. Defaults to
   * the current location (see `useReAuth`), which is `/workspaces` here; callers
   * pass the originally requested deep link so recovery returns there.
   */
  returnTo?: string;
}

/**
 * Recover a degraded session automatically.
 *
 * A degraded session is still authenticated; only its OAuth token family lost a
 * refresh (usually a transient rotation race), and the identity-provider session
 * is still live. So a silent re-auth (`useReAuth` clears the local session, then
 * the OAuth bounce returns immediately with a fresh code) mints a new family with
 * no user interaction. The handoff runs from an effect because the redirect is
 * client-only; until the browser navigates, this shows a neutral restoring state
 * rather than an error.
 *
 * It runs at most once per short window (see `reauthGuard`): if the silent
 * re-auth returned and the session is STILL degraded (the identity-provider
 * session is also gone, or `sessionStorage` is blocked so a loop cannot be
 * guarded), it shows a manual prompt instead of auto-retrying into a loop.
 */
const DegradedSessionRecovery = ({ returnTo }: Props) => {
  const reAuth = useReAuth(returnTo);
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    if (reauthRecentlyAttempted() || !markReauthAttempt()) {
      setShowManual(true);
      return;
    }

    reAuth();
  }, [reAuth]);

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4 p-6 text-center">
      <Logo className="size-10 text-primary-500" />

      {showManual ? (
        <>
          <h1 className="font-semibold text-base-900 text-xl dark:text-base-100">
            Your session expired
          </h1>
          <p className="max-w-sm text-base-600 text-sm dark:text-base-400">
            We could not restore your session automatically. Sign in again to
            continue.
          </p>
          <Button
            onClick={reAuth}
            className="bg-primary-500 text-base-950 hover:bg-primary-400 dark:bg-primary-500 dark:hover:bg-primary-400"
          >
            Sign in again
          </Button>
        </>
      ) : (
        <p className="flex items-center gap-2 text-base-600 text-sm dark:text-base-400">
          <Loader2Icon className="size-4 animate-spin" />
          Restoring your session...
        </p>
      )}
    </div>
  );
};

export default DegradedSessionRecovery;
