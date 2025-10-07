import { queryOptions } from "@tanstack/react-query";

import { useUserEmojisQuery } from "@/generated/graphql";

import type { UserEmojisQueryVariables } from "@/generated/graphql";

const userEmojisOptions = (variables: UserEmojisQueryVariables) =>
  queryOptions({
    queryKey: useUserEmojisQuery.getKey(variables),
    queryFn: useUserEmojisQuery.fetcher(variables),
  });

export default userEmojisOptions;
