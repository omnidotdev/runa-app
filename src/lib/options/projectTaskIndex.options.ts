import { queryOptions } from "@tanstack/react-query";

import { useProjectTaskIndexQuery } from "@/generated/graphql";

import type { ProjectTaskIndexQueryVariables } from "@/generated/graphql";

const projectTaskIndexOptions = (variables: ProjectTaskIndexQueryVariables) =>
  queryOptions({
    queryKey: useProjectTaskIndexQuery.getKey(variables),
    queryFn: useProjectTaskIndexQuery.fetcher(variables),
  });

export default projectTaskIndexOptions;
