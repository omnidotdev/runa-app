import { queryOptions } from "@tanstack/react-query";

import { useWorkspaceQuery } from "@/generated/graphql";

import type { WorkspaceQueryVariables } from "@/generated/graphql";

const workspaceOptions = (variables: WorkspaceQueryVariables) =>
  queryOptions({
    queryKey: useWorkspaceQuery.getKey(variables),
    queryFn: useWorkspaceQuery.fetcher(variables),
  });

export default workspaceOptions;
