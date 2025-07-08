import { queryOptions } from "@tanstack/react-query";

import { useWorkspacesQuery } from "@/generated/graphql";

interface Options {
  limit?: number;
}

const workspacesOptions = ({ limit }: Options = {}) =>
  queryOptions({
    queryKey: useWorkspacesQuery.getKey({ limit }),
    queryFn: useWorkspacesQuery.fetcher({ limit }),
  });

export default workspacesOptions;
