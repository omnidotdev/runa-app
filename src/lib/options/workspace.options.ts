import { queryOptions } from "@tanstack/react-query";

import { useWorkspaceQuery } from "@/generated/graphql";

interface Options {
  rowId: string;
}

const workspaceOptions = ({ rowId }: Options) =>
  queryOptions({
    queryKey: useWorkspaceQuery.getKey({ rowId }),
    queryFn: useWorkspaceQuery.fetcher({ rowId }),
  });

export default workspaceOptions;
