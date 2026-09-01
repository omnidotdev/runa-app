import { queryOptions } from "@tanstack/react-query";

import { getEntitlements } from "@/server/functions/subscriptions";

const entitlementsOptions = (organizationId: string) =>
  queryOptions({
    queryKey: ["billing", "entitlements", organizationId],
    queryFn: () => getEntitlements({ data: { organizationId } }),
  });

export default entitlementsOptions;
