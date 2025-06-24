import { GraphQLClient } from "graphql-request";

import { getSdk as getGraphQLSdk } from "@/generated/graphql.sdk";
import { API_GRAPHQL_URL } from "@/lib/config/env.config";

/**
 * Utility for getting the GraphQL client SDK.
 */
const getSdk = () => {
  const graphqlClient = new GraphQLClient(API_GRAPHQL_URL!);

  return getGraphQLSdk(graphqlClient);
};

export default getSdk;
