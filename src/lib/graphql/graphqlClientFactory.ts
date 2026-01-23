import { GraphQLClient } from "graphql-request";

import { API_GRAPHQL_URL } from "@/lib/config/env.config";

let client: GraphQLClient | null = null;

/**
 * Get the singleton GraphQL client instance.
 *
 * Note: Auth headers are NOT set on the client directly.
 * Instead, `graphqlFetch` fetches a fresh access token via server function
 * and passes it in the request headers for each request.
 */
export const getGraphQLClient = (): GraphQLClient => {
  if (!client) {
    client = new GraphQLClient(API_GRAPHQL_URL!, {
      headers: { "Content-Type": "application/json" },
    });
  }
  return client;
};
