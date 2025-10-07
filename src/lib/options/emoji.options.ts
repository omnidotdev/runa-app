import { queryOptions } from "@tanstack/react-query";

import { usePostEmojisQuery } from "@/generated/graphql";

import type { PostEmojisQueryVariables } from "@/generated/graphql";

const postEmojisOptions = (variables: PostEmojisQueryVariables) =>
  queryOptions({
    queryKey: usePostEmojisQuery.getKey(variables),
    queryFn: usePostEmojisQuery.fetcher(variables),
  });

export default postEmojisOptions;
