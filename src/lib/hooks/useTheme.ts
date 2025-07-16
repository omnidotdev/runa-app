import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { themeQueryKey, themeQueryOptions } from "@/lib/options/theme.options";
import { setTheme } from "@/lib/util/theme";
import { Route } from "@/routes/__root";

import type { Theme } from "@/lib/util/theme";

const useOptimisticThemeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (theme: Theme | "system") => setTheme({ data: theme }),
    onMutate: async (theme) => {
      await queryClient.cancelQueries({ queryKey: themeQueryKey });

      const previousTheme = queryClient.getQueryData(themeQueryKey);
      const nextTheme = theme === "system" ? null : theme;

      queryClient.setQueryData(themeQueryKey, nextTheme);

      return { previousTheme };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(themeQueryKey, context?.previousTheme);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: themeQueryKey });
    },
  });
};

export const useTheme = () => {
  const { requestInfo } = Route.useLoaderData();
  const { data: theme } = useSuspenseQuery(themeQueryOptions());

  const { mutate: setTheme } = useOptimisticThemeMutation();

  return {
    theme: theme ?? requestInfo.hints.theme,
    setTheme,
  };
};
