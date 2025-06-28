import { queryOptions } from "@tanstack/react-query";

import { useTaskQuery } from "@/generated/graphql";

const taskOptions = (rowId: string) =>
  queryOptions({
    queryKey: useTaskQuery.getKey({ rowId }),
    queryFn: useTaskQuery.fetcher({ rowId }),
  });

export default taskOptions;
