import { queryOptions } from "@tanstack/react-query";

import { useWorkspaceUsersQuery } from "@/generated/graphql";

const workspaceUsersOptions = (rowId: string) =>
  queryOptions({
    queryKey: useWorkspaceUsersQuery.getKey({ rowId }),
    queryFn: useWorkspaceUsersQuery.fetcher({ rowId }),
  });

export default workspaceUsersOptions;
