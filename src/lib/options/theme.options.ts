import { queryOptions } from "@tanstack/react-query";

import { getTheme } from "@/server/functions/theme";

export const themeQueryKey = ["theme"] as const;

const themeQueryOptions = () =>
  queryOptions({
    queryKey: themeQueryKey,
    queryFn: getTheme,
  });

export default themeQueryOptions;
