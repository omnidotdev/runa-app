import { queryOptions } from "@tanstack/react-query";

import { useAgentActivitiesByTaskIdQuery } from "@/generated/graphql";

import type { AgentActivitiesByTaskIdQueryVariables } from "@/generated/graphql";

const agentActivitiesByTaskIdOptions = (
  variables: AgentActivitiesByTaskIdQueryVariables,
) =>
  queryOptions({
    queryKey: useAgentActivitiesByTaskIdQuery.getKey(variables),
    queryFn: useAgentActivitiesByTaskIdQuery.fetcher(variables),
  });

export default agentActivitiesByTaskIdOptions;
