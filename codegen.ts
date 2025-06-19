import type { CodegenConfig } from "@graphql-codegen/cli";
import type { Types } from "@graphql-codegen/plugin-helpers";

type GraphQLCodegenConfig = Types.ConfiguredOutput;

// Define GraphQL API endpoint
const API_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "http://localhost:4000/graphql";

/**
 * Shared plugins across the generated GraphQL Codegen artifacts.
 */
const sharedPlugins: GraphQLCodegenConfig["plugins"] = [
  "typescript",
  "typescript-operations",
];

/**
 * Shared configuration across each of the generated GraphQL Codegen artifacts.
 */
const sharedConfig: GraphQLCodegenConfig["config"] = {
  scalars: {
    Date: "string",
    DateTime: "string",
    UUID: "string",
  },
};

const config: CodegenConfig = {
  schema: "src/graphql/schema.graphql",
  documents: "src/graphql/operations/**/*.graphql",
  ignoreNoDocuments: true, // for better experience with the watcher
  config: {
    sort: true,
  },
  generates: {
    // React Query hooks, types, and utilities
    "./src/graphql/generated/": {
      preset: "client",
      plugins: [...sharedPlugins, "typescript-react-query"],
      config: {
        ...sharedConfig,
        reactQueryVersion: 5,
        addInfiniteQuery: true,
        exposeQueryKeys: true,
        exposeMutationKeys: true,
        exposeFetcher: true,
        fetcher: {
          func: "../../utils/graphql-client#fetcher",
        },
        pureMagicComment: true,
        dedupeFragments: true,
      },
    },
  },
};

export default config;
