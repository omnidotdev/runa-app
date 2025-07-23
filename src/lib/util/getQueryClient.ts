import {
  isServer,
  MutationCache,
  matchQuery,
  QueryClient as ReactQueryClient,
} from "@tanstack/react-query";

import type { QueryKey } from "@tanstack/react-query";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidates?: Array<QueryKey>;
    };
  }
}

let browserQueryClient: ReactQueryClient | undefined;

/**
 * Creates a query client.
 */
const makeQueryClient = () => {
  const queryClient = new ReactQueryClient({
    defaultOptions: {
      queries: {
        // NB: with SSR, it is recommended to set a default staleTime above 0 to avoid refetching immediately on the client. See: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#initial-setup
        staleTime: 60 * 1000,
        // TODO: discuss. With SSR, the `gcTime` of any query that is used in loader's through `ensureQueryData` will always take this default. The issue is that when it is hydrated on the client, options are *not* dehydrated, so they do not get overwritten, See: https://github.com/TanStack/query/issues/9335#issuecomment-3063346026
        gcTime: 1000,
      },
    },
    mutationCache: new MutationCache({
      onSettled: (_data, _error, _variables, _context, mutation) => {
        queryClient.invalidateQueries({
          predicate: (query) => {
            // if `all` is included in the pattern, invalidate entire cache
            if (
              mutation.meta?.invalidates?.some((queryKey) =>
                queryKey.includes("all"),
              )
            ) {
              return true;
            }

            // invalidate all matching tags at once
            // or nothing if no meta is provided
            return (
              mutation.meta?.invalidates?.some((queryKey) =>
                matchQuery({ queryKey }, query),
              ) ?? false
            );
          },
        });
      },
    }),
  });

  return queryClient;
};

/**
 * Retrieves an existing query client if used in a browser context (i.e. provider), otherwise creates a new one.
 */
const getQueryClient = () => {
  if (isServer) return makeQueryClient();

  // ! NB: Important to make a new query client if we don't already have one. This is so we don't re-make a new client if React suspends during the initial render. See: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#initial-setup
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
};

export default getQueryClient;
