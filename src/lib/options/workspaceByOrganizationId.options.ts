import { queryOptions } from "@tanstack/react-query";

import { useWorkspaceByOrganizationIdQuery } from "@/generated/graphql";

import type { WorkspaceByOrganizationIdQueryVariables } from "@/generated/graphql";

const workspaceByOrganizationIdOptions = (
  variables: WorkspaceByOrganizationIdQueryVariables,
) =>
  queryOptions({
    queryKey: useWorkspaceByOrganizationIdQuery.getKey(variables),
    queryFn: useWorkspaceByOrganizationIdQuery.fetcher(variables),
  });

export default workspaceByOrganizationIdOptions;
