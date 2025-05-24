import { getQueryClient } from './graphql-client';

/**
 * API endpoint for GraphQL requests
 */
export const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:4000/graphql';

/**
 * Creates headers for GraphQL requests
 * @param token Optional authentication token
 * @returns Headers for the request
 */
export const createHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Creates a configuration object for GraphQL queries
 * @param token Optional authentication token
 * @returns Configuration object with endpoint and headers
 */
export const createGraphQLClient = (token?: string) => {
  return {
    endpoint: GRAPHQL_ENDPOINT,
    fetchParams: {
      headers: createHeaders(token),
      credentials: 'include', // Include cookies if using session-based auth
    },
  };
};

/**
 * Prepares GraphQL queries with proper client configuration and caching
 * @param token Optional authentication token
 */
export const prepareGraphQLRequests = (token?: string) => {
  const client = createGraphQLClient(token);
  const queryClient = getQueryClient();
  
  return {
    client,
    queryClient,
  };
};