import { queryOptions } from "@tanstack/react-query";

import { getSubscription } from "@/server/functions/subscriptions";

const subscriptionOptions = (settingId: string) =>
  queryOptions({
    queryKey: ["stripe", "subscription", settingId],
    queryFn: () => getSubscription({ data: { settingId } }),
  });

export default subscriptionOptions;
