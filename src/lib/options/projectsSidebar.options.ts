import { queryOptions } from "@tanstack/react-query";

import { useProjectsSidebarQuery } from "@/generated/graphql";

import type { ProjectsSidebarQueryVariables } from "@/generated/graphql";

const projectsSidebarOptions = (variables: ProjectsSidebarQueryVariables) =>
  queryOptions({
    queryKey: useProjectsSidebarQuery.getKey(variables),
    queryFn: useProjectsSidebarQuery.fetcher(variables),
  });

export default projectsSidebarOptions;
