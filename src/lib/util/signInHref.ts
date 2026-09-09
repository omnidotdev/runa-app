/**
 * Build the sign-in handoff URL that returns the visitor to `path` after
 * authentication. Used by loaders for surfaces that are not viewable while
 * logged out (private or nonexistent projects/tasks) to redirect to `/signin`
 * instead of surfacing a 404.
 */
const signInHref = (path: string) =>
  `/signin?redirect=${encodeURIComponent(path)}`;

export default signInHref;
