import { queryOptions } from "@tanstack/react-query";

import { useProjectsQuery } from "@/generated/graphql";

interface Options {
  workspaceId: string;
  search?: string;
}

const projectsOptions = ({ workspaceId, search }: Options) =>
  queryOptions({
    queryKey: useProjectsQuery.getKey({ workspaceId, search }),
    queryFn: useProjectsQuery.fetcher({ workspaceId, search }),
  });

export default projectsOptions;
