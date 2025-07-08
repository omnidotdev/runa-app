import { queryOptions } from "@tanstack/react-query";

import { useWorkspaceUsersQuery } from "@/generated/graphql";

interface Options {
  rowId: string;
}

const workspaceUsersOptions = ({ rowId }: Options) =>
  queryOptions({
    queryKey: useWorkspaceUsersQuery.getKey({ rowId }),
    queryFn: useWorkspaceUsersQuery.fetcher({ rowId }),
  });

export default workspaceUsersOptions;
