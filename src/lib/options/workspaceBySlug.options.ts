import { queryOptions } from "@tanstack/react-query";

import { useWorkspaceBySlugQuery } from "@/generated/graphql";

import type { WorkspaceBySlugQueryVariables } from "@/generated/graphql";

const workspaceBySlugOptions = (variables: WorkspaceBySlugQueryVariables) =>
  queryOptions({
    queryKey: useWorkspaceBySlugQuery.getKey(variables),
    queryFn: useWorkspaceBySlugQuery.fetcher(variables),
    // NB: important to garbage collect this immediately when not in use anymore due to `ensureQueryData` being used for loaders. That way when `slug` gets updated and the route changes, the *old* cache will be cleared
    gcTime: 0,
  });

export default workspaceBySlugOptions;
