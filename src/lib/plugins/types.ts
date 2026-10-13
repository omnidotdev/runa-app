/**
 * Core types for the Runa plugin system. A plugin is third-party code that
 * extends Runa through declared extension points, running sandboxed and limited
 * to the scopes the installing workspace granted it. See the plan at
 * ~/projects/omni/plans/2026-10-13-runa-plugin-system.md.
 */

/**
 * A capability a plugin may request. Scopes gate every host-bridge method and
 * are the single source of truth for what a plugin is allowed to do; they are
 * enforced on the host side (and, for data access, server-side via the plugin's
 * scoped API token), never by trusting plugin code.
 */
export type PluginScope =
  | "context:read"
  | "storage"
  | "task:read"
  | "task:write";

/** A UI slot a plugin can render into. v1 ships the task-detail panel. */
export interface PluginExtensionPoints {
  /** Renders a section inside the task detail view. */
  taskPanel?: { url: string };
}

/** A plugin's declared identity, requested scopes, and extension points. */
export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  scopes: PluginScope[];
  extensionPoints: PluginExtensionPoints;
}
