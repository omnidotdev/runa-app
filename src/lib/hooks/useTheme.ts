import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import themeQueryOptions, { themeQueryKey } from "@/lib/options/theme.options";
import { Route } from "@/routes/__root";
import { setTheme } from "@/server/functions/theme";

import type { Theme } from "@/server/functions/theme";

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

const useTheme = () => {
  const { requestInfo } = Route.useLoaderData();
  const { data: theme } = useSuspenseQuery(themeQueryOptions());

  const { mutate: setTheme } = useOptimisticThemeMutation();

  return {
    theme: theme ?? requestInfo.hints.theme,
    setTheme,
  };
};

export default useTheme;
