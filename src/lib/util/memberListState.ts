interface MemberListStateArgs {
  /** Session is authenticated but has no access token (failed token refresh). */
  degraded: boolean;
  /** The members query errored (network, 5xx, or a server-side Forbidden). */
  isError: boolean;
  /** Number of members the query returned. */
  memberCount: number;
}

/**
 * What a member-selection UI should render.
 *
 * - `list`: show the members
 * - `degraded`: session needs refresh, prompt re-auth
 * - `error`: the member list failed to load, offer a retry
 * - `empty`: the workspace genuinely has no members
 */
export type MemberListState = "list" | "degraded" | "error" | "empty";

/**
 * Decide what a member-selection UI should render, distinguishing a failure to
 * load the member list from a genuinely empty workspace.
 *
 * Without this split a degraded session (the refresh-token grant failed, so the
 * server could not hydrate the caller's organizations and the membership gate
 * refuses the read) or any server error both collapse into the misleading "No
 * members found", which implies the workspace has zero members. A workspace
 * with members already loaded always wins, so a background refetch error never
 * blanks an otherwise-usable list.
 */
const memberListState = ({
  degraded,
  isError,
  memberCount,
}: MemberListStateArgs): MemberListState => {
  if (memberCount > 0) return "list";
  if (degraded) return "degraded";
  if (isError) return "error";
  return "empty";
};

export default memberListState;
