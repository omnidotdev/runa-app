import { queryOptions } from "@tanstack/react-query";

import { useAgentActivitiesQuery } from "@/generated/graphql";

import type { AgentActivitiesQueryVariables } from "@/generated/graphql";

const agentActivitiesOptions = (variables: AgentActivitiesQueryVariables) =>
  queryOptions({
    queryKey: useAgentActivitiesQuery.getKey(variables),
    queryFn: useAgentActivitiesQuery.fetcher(variables),
  });

export default agentActivitiesOptions;
