import type { KnipConfig } from "knip";

/**
 * Knip configuration.
 * @see https://knip.dev/overview/configuration
 */
const knipConfig: KnipConfig = {
  entry: [
    "src/routes/**/*.{ts,tsx}",
    "src/router.tsx",
    "src/lib/graphql/graphqlFetch.ts",
    // Plugin subsystem public API: `host` is the embedding entry (mounted by the
    // app's extension points) and `sdk` is imported by out-of-repo plugin bundles,
    // so neither has an in-repo importer by design.
    "src/lib/plugins/host.ts",
    "src/lib/plugins/sdk.ts",
  ],
  // NB: files are reported as unused if they are in the set of project files, but not in the set of files resolved from the entry files. See: https://knip.dev/guides/configuring-project-files
  project: ["src/**/*.{ts,tsx,css}"],
  // NB: Modified from the default GraphQL Codegen configuration, see: https://knip.dev/reference/plugins/graphql-codegen
  "graphql-codegen": {
    config: ["package.json", "src/lib/graphql/codegen.config.ts"],
  },
  // used for proper management of Thornberry components, see https://knip.dev/reference/configuration#ignoreexportsusedinfile
  ignoreExportsUsedInFile: true,
  ignore: ["src/generated/**", "src/routeTree.gen.ts"],
  ignoreDependencies: [
    // used by GraphQL Code Generator scripts
    "dotenv",
    // used via subpath imports (e.g. @omnidotdev/providers/billing)
    "@omnidotdev/providers",
    // used at runtime via dynamic import in feature flags provider
    "unleash-client",
  ],
  tags: ["-knipignore"],
};

export default knipConfig;
