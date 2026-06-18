import { queryOptions } from "@tanstack/react-query";

import { useTaskAttachmentsQuery } from "@/generated/graphql";

import type { TaskAttachmentsQueryVariables } from "@/generated/graphql";

const taskAttachmentsOptions = (variables: TaskAttachmentsQueryVariables) =>
  queryOptions({
    queryKey: useTaskAttachmentsQuery.getKey(variables),
    queryFn: useTaskAttachmentsQuery.fetcher(variables),
  });

export default taskAttachmentsOptions;
