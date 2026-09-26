type ViewMode = "board" | "list";

interface ViewModeToggle {
  /** Whether the caller must create a new preference row or patch an existing one. */
  action: "create" | "update";
  /** The view mode to persist. */
  viewMode: ViewMode;
}

/**
 * Decide how to persist a board view-mode toggle.
 *
 * A `UserPreference` row is created lazily (only once a user first hides a
 * column), so most users have no row when they first toggle the view. The
 * update mutation requires a `rowId`, so toggling without a row must CREATE the
 * row instead of updating a nonexistent one, otherwise the write fails silently
 * and the UI snaps back to the board (kanban) default on refetch.
 *
 * Any non-`"list"` value (including a missing one) is treated as board, so the
 * toggle target is the inverse.
 */
const resolveViewModeToggle = (
  userPreferences:
    | { rowId?: string | null; viewMode?: string | null }
    | null
    | undefined,
): ViewModeToggle => ({
  action: userPreferences?.rowId ? "update" : "create",
  viewMode: userPreferences?.viewMode !== "list" ? "list" : "board",
});

export default resolveViewModeToggle;
