import { queryOptions } from "@tanstack/react-query";

import { useWorkspacesQuery } from "@/generated/graphql";

import type { WorkspacesQueryVariables } from "@/generated/graphql";

const workspacesOptions = (variables: WorkspacesQueryVariables) =>
  queryOptions({
    queryKey: useWorkspacesQuery.getKey(variables),
    queryFn: useWorkspacesQuery.fetcher(variables),
  });

export default workspacesOptions;
