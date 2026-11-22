import type { WorkspaceClaim } from "@omnidotdev/providers/react";
import type { WorkspaceOption } from "@omnidotdev/thornberry/workspace-switcher";

/**
 * Route slug of a workspace (the `/@{slug}` segment), falling back to its id
 * when the claim carries no slug.
 */
const routeSlugOf = (workspace: WorkspaceClaim): string =>
  workspace.slug || workspace.id;

/**
 * Map the user's workspace claims onto the shared switcher's options, keyed by
 * workspace id.
 */
export const toWorkspaceOptions = (
  workspaces: WorkspaceClaim[],
): WorkspaceOption[] =>
  workspaces.map((workspace) => ({
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    logo: workspace.logo,
  }));

/**
 * Id of the workspace a route slug points at, if the user belongs to it.
 */
export const workspaceIdForSlug = (
  workspaces: WorkspaceClaim[],
  slug: string | undefined,
): string | undefined =>
  slug
    ? workspaces.find((workspace) => routeSlugOf(workspace) === slug)?.id
    : undefined;

/**
 * Route slug to navigate to for a selected workspace id.
 */
export const routeSlugForId = (
  workspaces: WorkspaceClaim[],
  id: string,
): string | undefined => {
  const workspace = workspaces.find((candidate) => candidate.id === id);

  return workspace ? routeSlugOf(workspace) : undefined;
};
