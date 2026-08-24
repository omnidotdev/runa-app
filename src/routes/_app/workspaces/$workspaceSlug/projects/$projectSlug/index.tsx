import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy project path. Permanently redirects to the flat, handle-based project
 * route (`/@$workspaceSlug/$projectSlug`) per golden/URL-GRAMMAR.md. Carries the
 * `mode=public` search param through for shared public-board links.
 */
export const Route = createFileRoute(
  "/_app/workspaces/$workspaceSlug/projects/$projectSlug/",
)({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode === "public" ? ("public" as const) : undefined,
  }),
  beforeLoad: ({ params, search }) => {
    throw redirect({
      to: "/@$workspaceSlug/$projectSlug",
      params: {
        workspaceSlug: params.workspaceSlug,
        projectSlug: params.projectSlug,
      },
      search: { mode: search.mode },
    });
  },
});
