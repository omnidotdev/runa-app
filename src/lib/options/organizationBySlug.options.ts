import { queryOptions } from "@tanstack/react-query";

import { getOrganizationBySlug } from "@/server/functions/organizations";

/**
 * Live authenticated fetch of a workspace (organization) by slug from
 * Gatekeeper, including its current links. Used to show freshly edited
 * workspace links without waiting for the JWT claim to refresh. Cached with a
 * window-focus revalidation so returning from the account hub reflects edits
 * within moments, while the claim remains the instant-boot fallback.
 */
const organizationBySlugOptions = (slug: string | undefined) =>
  queryOptions({
    queryKey: ["organizationBySlug", slug],
    queryFn: () => getOrganizationBySlug({ data: { slug: slug! } }),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

export default organizationBySlugOptions;
