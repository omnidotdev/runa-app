import { queryOptions } from "@tanstack/react-query";

import { useUsersQuery } from "@/generated/graphql";

const usersOptions = queryOptions({
  queryKey: useUsersQuery.getKey(),
  queryFn: useUsersQuery.fetcher(),
});

export default usersOptions;
