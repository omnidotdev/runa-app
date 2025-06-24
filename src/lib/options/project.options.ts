import { queryOptions } from "@tanstack/react-query";

import { useProjectQuery } from "@/generated/graphql";

const projectOptions = (rowId: string) =>
  queryOptions({
    queryKey: useProjectQuery.getKey({ rowId }),
    queryFn: useProjectQuery.fetcher({ rowId }),
  });

export default projectOptions;
