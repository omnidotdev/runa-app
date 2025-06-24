import { queryOptions } from "@tanstack/react-query";

import { useWorkspaceQuery } from "@/generated/graphql";

const workspaceOptions = (rowId: string) =>
  queryOptions({
    queryKey: useWorkspaceQuery.getKey({ rowId }),
    queryFn: useWorkspaceQuery.fetcher({ rowId }),
  });

export default workspaceOptions;
