import { queryOptions } from "@tanstack/react-query";

import { useWorkspaceBySlugQuery } from "@/generated/graphql";

import type { WorkspaceBySlugQueryVariables } from "@/generated/graphql";

const workspaceBySlugOptions = (variables: WorkspaceBySlugQueryVariables) =>
  queryOptions({
    queryKey: useWorkspaceBySlugQuery.getKey(variables),
    queryFn: useWorkspaceBySlugQuery.fetcher(variables),
  });

export default workspaceBySlugOptions;
