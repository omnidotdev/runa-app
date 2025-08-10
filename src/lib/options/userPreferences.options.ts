import { queryOptions } from "@tanstack/react-query";

import { useUserPreferencesQuery } from "@/generated/graphql";

import type { UserPreferencesQueryVariables } from "@/generated/graphql";

const userPreferencesOptions = (variables: UserPreferencesQueryVariables) =>
  queryOptions({
    queryKey: useUserPreferencesQuery.getKey(variables),
    queryFn: useUserPreferencesQuery.fetcher(variables),
  });

export default userPreferencesOptions;
