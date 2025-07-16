import { queryOptions } from "@tanstack/react-query";

import { getTheme } from "@/lib/util/theme";

export const themeQueryKey = ["theme"] as const;

export const themeQueryOptions = () => {
  return queryOptions({
    queryKey: themeQueryKey,
    queryFn: getTheme,
  });
};
