import { QueryClient } from '@tanstack/react-query';
import { isServer } from '@tanstack/react-query';

// Define the GraphQL endpoint URL
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:4000/graphql';

/**
 * Fetcher function to be used with GraphQL Code Generator's React Query hooks
 */
export const fetcher = <TData, TVariables>(
  query: string,
  variables?: TVariables,
  options?: RequestInit['headers']
): (() => Promise<TData>) => {
  return async () => {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      credentials: 'include', // Include cookies if using session-based auth
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0] || 'Error fetching data';
      throw new Error(message);
    }

    return json.data;
  };
};

// Store the QueryClient for browser environments to avoid recreating it on each render
let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Creates a new QueryClient with default configuration
 */
const makeQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, it's recommended to set staleTime above 0 to avoid refetching on client
        staleTime: 60 * 1000, // 1 minute
        // Prevent refetching when window regains focus
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  return queryClient;
};

/**
 * Retrieves an existing query client if used in a browser context, otherwise creates a new one.
 * This ensures we don't create multiple clients during server-side rendering.
 */
export const getQueryClient = () => {
  if (isServer) return makeQueryClient();

  // Create a new client only if one doesn't exist yet
  // This prevents recreation during React suspense
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
};