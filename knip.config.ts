import type { KnipConfig } from "knip";

/**
 * Knip configuration.
 * @see https://knip.dev/overview/configuration
 */
const knipConfig: KnipConfig = {
  entry: ["src/routes/**/*.{ts,tsx}", "src/router.tsx"],
  // NB: files are reported as unused if they are in the set of project files, but not in the set of files resolved from the entry files. See: https://knip.dev/guides/configuring-project-files
  project: ["src/**/*.{ts,tsx}"],
  // NB: Modified from the default GraphQL Codegen configuration, see: https://knip.dev/reference/plugins/graphql-codegen
  "graphql-codegen": {
    config: ["package.json", "src/lib/graphql/codegen.config.ts"],
  },
  ignore: [
    "src/generated/**",
    // TODO: remove when remote data fetching is set up
    "src/lib/graphql/getSdk.ts",
    // TODO: remove when remote data fetching is set up
    "src/lib/graphql/graphqlFetch.ts",
    "src/routeTree.gen.ts",
  ],
  ignoreDependencies: [
    // used by GraphQL Code Generator scripts
    "dotenv",
    "tw-animate-css",
  ],
};

export default knipConfig;
