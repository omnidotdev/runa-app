import { queryOptions } from "@tanstack/react-query";

import { useWorkspaceUsersQuery } from "@/generated/graphql";

const workspacesUsersOptions = (rowId: string) =>
  queryOptions({
    queryKey: useWorkspaceUsersQuery.getKey({ rowId }),
    queryFn: useWorkspaceUsersQuery.fetcher({ rowId }),
  });

export default workspacesUsersOptions;
