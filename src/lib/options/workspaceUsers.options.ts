import { queryOptions } from "@tanstack/react-query";

import { useWorkspaceUsersQuery } from "@/generated/graphql";

import type { WorkspaceUsersQueryVariables } from "@/generated/graphql";

const workspaceUsersOptions = (variables: WorkspaceUsersQueryVariables) =>
  queryOptions({
    queryKey: useWorkspaceUsersQuery.getKey(variables),
    queryFn: useWorkspaceUsersQuery.fetcher(variables),
  });

export default workspaceUsersOptions;
