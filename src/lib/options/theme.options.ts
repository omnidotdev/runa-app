import { queryOptions } from "@tanstack/react-query";

import { getTheme } from "@/lib/util/theme";

export const themeQueryKey = ["theme"] as const;

const themeQueryOptions = () =>
  queryOptions({
    queryKey: themeQueryKey,
    queryFn: getTheme,
  });

export default themeQueryOptions;
