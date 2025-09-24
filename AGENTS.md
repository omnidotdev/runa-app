# AGENTS.md

## Build/Test/Lint Commands

- **Dev**: `bun run dev` - Starts dev server with GraphQL codegen watch
- **Build**: `bun run build` - Production build
- **Lint**: `bun run lint` - Run Biome linter (errors only)
- **Format**: `bun run format` - Format with Biome
- **Check**: `bun run check` - Full Biome checks
- **GraphQL**: `bun run graphql:generate` - Generate types/hooks from schema
- **Tests**: No test framework configured - verify manually via build/lint

## Code Style Guidelines

- **Formatter**: Biome (80 char line width, 2 space indent)
- **Imports**: Auto-organized by Biome - Node/Bun → packages → local → types (with blank lines)
- **Types**: Use `type` imports (`import type {}`), strict TypeScript mode
- **Naming**: camelCase for variables/functions, PascalCase for components/types, kebab-case for files
- **Components**: Default exports for React components, named exports for utilities
- **GraphQL**: Mutations in `.mutation.graphql` files, queries use TanStack Query options pattern
- **State**: Zustand stores in `store/` directory, TanStack Query for server state
- **Error Handling**: Use toast notifications (sonner), no console.log (only error/warn allowed)
- **Styling**: TailwindCSS with `cn()` utility, Ark UI components in `ui/` directory
- **File Structure**: Feature-based organization, generated files in `generated/` (excluded from linting)

## Key Patterns

- Route context provides QueryClient and session
- GraphQL codegen creates TypeScript types, React Query hooks, and SDK
- Use `@/` path alias for src imports

