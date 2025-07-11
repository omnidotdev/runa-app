import { queryOptions } from "@tanstack/react-query";

import { useProjectsQuery } from "@/generated/graphql";

import type { ProjectsQueryVariables } from "@/generated/graphql";

const projectsOptions = (variables: ProjectsQueryVariables) =>
  queryOptions({
    queryKey: useProjectsQuery.getKey(variables),
    queryFn: useProjectsQuery.fetcher(variables),
  });

export default projectsOptions;
