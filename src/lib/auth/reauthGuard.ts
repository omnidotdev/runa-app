/**
 * One-shot guard for automatic degraded-session recovery.
 *
 * A degraded session recovers by silently re-authenticating against the live
 * identity-provider session. That is safe to do automatically, but only once:
 * if the silent re-auth returns and the session is STILL degraded (e.g. the
 * identity-provider session is also gone), auto-retrying would redirect-loop.
 * This marks that an attempt was made so the recovery surface falls back to a
 * manual prompt instead of looping. The mark is stored in `sessionStorage`, so
 * it survives the OAuth redirect bounce within the tab and is dropped when the
 * tab closes.
 */
const GUARD_KEY = "runa.reauth.attemptedAt";

/** How long a recovery attempt suppresses another automatic one. */
const GUARD_WINDOW_MS = 90_000;

/** Whether a recovery attempt was made within the suppression window. */
export const reauthRecentlyAttempted = (): boolean => {
  try {
    const raw = sessionStorage.getItem(GUARD_KEY);
    if (!raw) return false;
    return Date.now() - Number(raw) < GUARD_WINDOW_MS;
  } catch {
    return false;
  }
};

/**
 * Record a recovery attempt. Returns `false` when `sessionStorage` is
 * unavailable, so the caller can decline to auto-retry (no guard means no loop
 * protection).
 */
export const markReauthAttempt = (): boolean => {
  try {
    sessionStorage.setItem(GUARD_KEY, String(Date.now()));
    return true;
  } catch {
    return false;
  }
};

/** Clear the guard once a healthy session is restored. */
export const clearReauthAttempt = (): void => {
  try {
    sessionStorage.removeItem(GUARD_KEY);
  } catch {
    // Ignore: a missing or blocked sessionStorage just means nothing to clear
  }
};
