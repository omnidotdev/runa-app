import { Button } from "@/components/ui/button";
import useReAuth from "@/lib/auth/useReAuth";

import type { MemberListState } from "@/lib/util/memberListState";

interface Props {
  /** Any non-`list` state (the caller renders the list itself). */
  state: Exclude<MemberListState, "list">;
  /** Refetch the member list (shown for a recoverable load error). */
  onRetry?: () => void;
}

/**
 * Empty/failure states for a member-selection UI.
 *
 * A degraded session or a failed load both lead with "Sign in again": the
 * common root cause is a session the server can no longer resolve to the
 * caller's organizations, which a fresh sign-in repairs. Only a genuinely
 * member-less workspace shows the plain "No members found".
 */
const MemberListStatus = ({ state, onRetry }: Props) => {
  const reAuth = useReAuth();

  if (state === "empty") {
    return <p className="py-6 text-center text-xs">No members found</p>;
  }

  return (
    <div className="flex flex-col items-center gap-2 py-6 text-center">
      <p className="max-w-[14rem] text-muted-foreground text-xs">
        {state === "degraded"
          ? "Your session expired, so members could not be loaded."
          : "Members could not be loaded."}
      </p>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={reAuth}>
          Sign in again
        </Button>
        {state === "error" && onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    </div>
  );
};

export default MemberListStatus;
