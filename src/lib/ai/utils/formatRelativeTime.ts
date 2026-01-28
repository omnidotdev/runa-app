import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/**
 * Format a date value as a human-readable relative time (e.g., "5 minutes ago").
 *
 * Centralizes dayjs + relativeTime plugin setup so the plugin extension
 * happens once, and all agent components share the same formatting logic.
 *
 * Accepts both string (ISO 8601) and Date objects since GraphQL
 * responses may return either type depending on the schema.
 */
export function formatRelativeTime(date: string | Date): string {
  return dayjs(date).fromNow();
}
