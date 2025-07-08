import { queryOptions } from "@tanstack/react-query";

import { useProjectQuery } from "@/generated/graphql";

interface Options {
  rowId: string;
}

const projectOptions = ({ rowId }: Options) =>
  queryOptions({
    queryKey: useProjectQuery.getKey({ rowId }),
    queryFn: useProjectQuery.fetcher({ rowId }),
  });

export default projectOptions;
