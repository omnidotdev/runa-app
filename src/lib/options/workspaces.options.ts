import { queryOptions } from "@tanstack/react-query";

import { useWorkspacesQuery } from "@/generated/graphql";

const workspacesOptions = queryOptions({
  queryKey: useWorkspacesQuery.getKey(),
  queryFn: useWorkspacesQuery.fetcher(),
});

export default workspacesOptions;
