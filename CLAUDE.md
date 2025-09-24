# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `bun run dev` - Start development server with GraphQL codegen watch and Vite dev server
- `bun run build` - Build for production
- `bun start` - Start production server

### Code Quality
- `bun run check` - Run Biome checks (errors only)
- `bun run format` - Format code with Biome
- `bun run lint` - Lint code with Biome (errors only)

### GraphQL
- `bun run graphql:generate` - Generate GraphQL types and hooks from schema
- `bun run graphql:generate:watch` - Watch mode for GraphQL generation

### Other Tools
- `bun run knip` - Find unused dependencies and exports

## Architecture Overview

This is a full-stack React application built with modern tools:

### Core Stack
- **Frontend Framework**: React 19 + TanStack Start (file-based routing)
- **Styling**: TailwindCSS 4 with custom components in `src/components/ui/`
- **State Management**: Zustand for client state, TanStack Query for server state
- **GraphQL**: Code generation from schema creates TypeScript types, React Query hooks, and SDK
- **Authentication**: Custom auth system with session management
- **Build Tool**: Vite with OXC React plugin for fast builds

### Key Directories
- `src/components/` - React components organized by feature
- `src/lib/graphql/` - GraphQL queries/mutations and generated types
- `src/routes/` - File-based routing (TanStack Router)
- `src/generated/` - Auto-generated GraphQL TypeScript code
- `src/lib/hooks/` - Custom React hooks and Zustand stores
- `src/lib/options/` - TanStack Query option factories

### GraphQL Integration
- Schema lives at `API_GRAPHQL_URL` environment variable
- Queries/mutations in `src/lib/graphql/queries/` and `src/lib/graphql/mutations/`
- Code generation creates: TypeScript types, React Query hooks, GraphQL request SDK
- Custom fetcher in `src/lib/graphql/graphqlFetch.ts` handles authentication

### Routing & State
- File-based routing with TanStack Router in `src/routes/`
- Route context includes QueryClient and session
- **IMPORTANT**: `createFileRoute` import is NOT needed - auto-handled by TanStack Start plugin with `verboseFileRoutes: false`
- Global state managed via Zustand stores in `src/lib/hooks/store/`
- Server state cached and synchronized via TanStack Query

### Component Architecture
- UI components in `src/components/ui/` built with Ark UI and styled with TailwindCSS
- Feature components organized by domain (projects, tasks, workspaces)
- Form handling with TanStack Form and Zod validation
- Drag-and-drop functionality using @dnd-kit

## Environment Configuration

Required environment variables defined in `src/lib/config/env.config.ts`:
- `VITE_API_BASE_URL` - Base API URL
- `VITE_API_GRAPHQL_URL` - GraphQL endpoint
- `VITE_BASE_URL` - Application base URL
- `VITE_AUTH_ISSUER` - Auth provider issuer
- Server-side: `AUTH_CLIENT_ID`, `AUTH_CLIENT_SECRET`, `POLAR_ACCESS_TOKEN`

## Code Style & Quality

- **Linter/Formatter**: Biome (not ESLint/Prettier)
- **Import Organization**: Auto-sorted with Biome
- **Type Safety**: TypeScript strict mode with generated GraphQL types
- **Styling**: TailwindCSS with automatic class sorting via Biome
- Development server runs on port 3000 with HTTPS via mkcert