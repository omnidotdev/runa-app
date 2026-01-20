/**
 * Generates a deterministic color from a user ID.
 * Uses a simple hash function to pick from a curated palette.
 */

const USER_COLOR_PALETTE = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#ec4899", // pink
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
  "#ef4444", // red
  "#6366f1", // indigo
  "#14b8a6", // teal
  "#a855f7", // purple
];

/**
 * Simple hash function for strings.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Gets a consistent color for a user based on their ID.
 * The same user ID will always return the same color.
 */
export default function getUserColor(userId: string): string {
  const hash = hashString(userId);
  const index = hash % USER_COLOR_PALETTE.length;
  return USER_COLOR_PALETTE[index];
}
