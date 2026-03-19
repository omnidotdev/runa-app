/**
 * Query options for tool registry.
 *
 * The tool registry provides metadata for AI tool classification,
 * enabling proper UI rendering and cache invalidation.
 *
 * This is static configuration data that doesn't change during runtime,
 * so we use `staleTime: Infinity` to cache it permanently.
 */

import { queryOptions } from "@tanstack/react-query";

import { API_BASE_URL } from "@/lib/config/env.config";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

/** Tool category for classification. */
export type ToolCategory =
  | "query"
  | "write"
  | "destructive"
  | "delegation"
  | "projectCreation";

/** Entity type the tool operates on. */
export type ToolEntity = "task" | "column" | "label" | "comment" | "project";

/** Metadata for a single tool. */
export interface ToolMetadata {
  category: ToolCategory;
  entity: ToolEntity | null;
}

/** Registry response from API. */
export interface ToolRegistryResponse {
  tools: Record<string, ToolMetadata>;
  categories: ToolCategory[];
  entities: (ToolEntity | null)[];
}

// ─────────────────────────────────────────────
// Query Key
// ─────────────────────────────────────────────

export const toolRegistryQueryKey = ["ToolRegistry"] as const;

// ─────────────────────────────────────────────
// Fetcher
// ─────────────────────────────────────────────

async function fetchToolRegistry(): Promise<ToolRegistryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ai/tools/registry`);

  if (!response.ok) {
    throw new Error(`Failed to fetch tool registry: ${response.status}`);
  }

  return response.json() as Promise<ToolRegistryResponse>;
}

// ─────────────────────────────────────────────
// Options
// ─────────────────────────────────────────────

const toolRegistryOptions = () =>
  queryOptions({
    queryKey: toolRegistryQueryKey,
    queryFn: fetchToolRegistry,
    // Static data - cache forever, never refetch
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

export default toolRegistryOptions;

// ─────────────────────────────────────────────
// Classification Helpers
// ─────────────────────────────────────────────

/**
 * Check if a tool is a write operation (triggers cache invalidation).
 */
export function isWriteTool(
  toolName: string,
  registry: ToolRegistryResponse,
): boolean {
  const meta = registry.tools[toolName];
  if (!meta) return false;
  return (
    meta.category === "write" ||
    meta.category === "destructive" ||
    meta.category === "projectCreation"
  );
}

/**
 * Check if a tool is destructive (delete operations).
 */
export function isDestructiveTool(
  toolName: string,
  registry: ToolRegistryResponse,
): boolean {
  return registry.tools[toolName]?.category === "destructive";
}

/**
 * Check if a tool is a column operation.
 */
export function isColumnTool(
  toolName: string,
  registry: ToolRegistryResponse,
): boolean {
  return registry.tools[toolName]?.entity === "column";
}

/**
 * Check if a tool is a delegation operation.
 */
export function isDelegationTool(
  toolName: string,
  registry: ToolRegistryResponse,
): boolean {
  return registry.tools[toolName]?.category === "delegation";
}

/**
 * Check if a tool is a project creation operation.
 */
export function isProjectCreationTool(
  toolName: string,
  registry: ToolRegistryResponse,
): boolean {
  return registry.tools[toolName]?.category === "projectCreation";
}
