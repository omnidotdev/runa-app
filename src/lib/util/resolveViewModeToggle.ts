export type ViewMode = "board" | "list" | "calendar";

interface ViewModeToggle {
  /** Whether the caller must create a new preference row or patch an existing one. */
  action: "create" | "update";
  /** The view mode to persist. */
  viewMode: ViewMode;
}

/** Cycle order for the single view-mode toggle button / hotkey. */
const VIEW_MODE_ORDER: ViewMode[] = ["board", "list", "calendar"];

/**
 * Decide how to persist the next view mode when the toggle is pressed.
 *
 * The toggle cycles board -> list -> calendar -> board. A `UserPreference` row
 * is created lazily (only once a user first hides a column), so most users have
 * no row when they first toggle; the update mutation requires a `rowId`, so
 * toggling without a row must CREATE the row instead of updating a nonexistent
 * one, otherwise the write fails silently and the UI snaps back to the board
 * (kanban) default on refetch.
 *
 * An unknown or missing current mode is treated as board (cycles to list).
 */
const resolveViewModeToggle = (
  userPreferences:
    | { rowId?: string | null; viewMode?: string | null }
    | null
    | undefined,
): ViewModeToggle => {
  const currentIndex = VIEW_MODE_ORDER.indexOf(
    userPreferences?.viewMode as ViewMode,
  );
  const fromIndex = currentIndex < 0 ? 0 : currentIndex;
  const viewMode = VIEW_MODE_ORDER[(fromIndex + 1) % VIEW_MODE_ORDER.length]!;
  return {
    action: userPreferences?.rowId ? "update" : "create",
    viewMode,
  };
};

export default resolveViewModeToggle;
