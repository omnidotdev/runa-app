import { queryOptions } from "@tanstack/react-query";

import { useProjectBySlugQuery } from "@/generated/graphql";

import type { ProjectBySlugQueryVariables } from "@/generated/graphql";

const projectBySlugOptions = (variables: ProjectBySlugQueryVariables) =>
  queryOptions({
    queryKey: useProjectBySlugQuery.getKey(variables),
    queryFn: useProjectBySlugQuery.fetcher(variables),
  });

export default projectBySlugOptions;
