import { queryOptions } from "@tanstack/react-query";

import { useProjectsQuery } from "@/generated/graphql";

const projectsOptions = queryOptions({
  queryKey: useProjectsQuery.getKey(),
  queryFn: useProjectsQuery.fetcher(),
});

export default projectsOptions;
