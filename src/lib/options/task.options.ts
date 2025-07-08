import { queryOptions } from "@tanstack/react-query";

import { useTaskQuery } from "@/generated/graphql";

interface Options {
  rowId: string;
}

const taskOptions = ({ rowId }: Options) =>
  queryOptions({
    queryKey: useTaskQuery.getKey({ rowId }),
    queryFn: useTaskQuery.fetcher({ rowId }),
  });

export default taskOptions;
