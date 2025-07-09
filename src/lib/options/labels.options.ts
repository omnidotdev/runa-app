import { queryOptions } from "@tanstack/react-query";

import { useLabelsQuery } from "@/generated/graphql";

interface Options {
  projectId: string;
}

const labelsOptions = ({ projectId }: Options) =>
  queryOptions({
    queryKey: useLabelsQuery.getKey({ projectId }),
    queryFn: useLabelsQuery.fetcher({ projectId }),
  });

export default labelsOptions;
