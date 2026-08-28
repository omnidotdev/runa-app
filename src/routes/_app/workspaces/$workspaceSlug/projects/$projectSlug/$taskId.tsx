import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy task permalink. Permanently redirects to the handle-based task route
 * (`/@{$workspaceSlug}/$projectSlug/$taskId`) per golden/URL-GRAMMAR.md. The
 * `$taskId` vanity key is carried through and canonicalized downstream.
 */
export const Route = createFileRoute(
  "/_app/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
)({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/@{$workspaceSlug}/$projectSlug/$taskId",
      params: {
        workspaceSlug: params.workspaceSlug,
        projectSlug: params.projectSlug,
        taskId: params.taskId,
      },
    });
  },
});
