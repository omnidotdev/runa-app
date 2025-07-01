import { queryOptions } from "@tanstack/react-query";

import { useProjectsQuery } from "@/generated/graphql";

const projectsOptions = (workspaceId: string, search?: string) =>
  queryOptions({
    queryKey: useProjectsQuery.getKey({ workspaceId, search }),
    queryFn: useProjectsQuery.fetcher({ workspaceId, search }),
  });

export default projectsOptions;
