import { queryOptions } from "@tanstack/react-query";

import { useWorkspaceLabelsQuery } from "@/generated/graphql";

import type { WorkspaceLabelsQueryVariables } from "@/generated/graphql";

/**
 * Workspace-shared labels (org-scoped), usable across every board in the
 * workspace. Merged with a board's own project-scoped labels in the label picker.
 */
const workspaceLabelsOptions = (variables: WorkspaceLabelsQueryVariables) =>
  queryOptions({
    queryKey: useWorkspaceLabelsQuery.getKey(variables),
    queryFn: useWorkspaceLabelsQuery.fetcher(variables),
  });

export default workspaceLabelsOptions;
