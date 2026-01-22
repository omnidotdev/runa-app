import { queryOptions } from "@tanstack/react-query";

import { getSubscription } from "@/server/functions/subscriptions";

const subscriptionOptions = (organizationId: string) =>
  queryOptions({
    queryKey: ["stripe", "subscription", organizationId],
    queryFn: () => getSubscription({ data: { organizationId } }),
  });

export default subscriptionOptions;
