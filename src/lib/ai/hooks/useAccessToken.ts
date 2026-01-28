import { useRouteContext } from "@tanstack/react-router";

/**
 * Hook to access the current user's access token from route context.
 *
 * Reads from the root route context where the session (including
 * accessToken) is resolved during `beforeLoad`. This eliminates
 * prop drilling of the token through component trees.
 *
 * @throws if called outside of a route context or when no session exists
 */
export function useAccessToken(): string {
  const { session } = useRouteContext({ from: "__root__" });

  if (!session?.accessToken) {
    throw new Error("No access token available. User may not be authenticated.");
  }

  return session.accessToken;
}
