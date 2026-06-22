/**
 * Resolve which column a context-scoped action (e.g. quick-add via `C`) targets.
 *
 * Focus wins over hover so keyboard navigation is deterministic and not subject
 * to mouse-leave/focus event ordering. Falls back to the first column when
 * nothing is active. Returns `undefined` (never `null`) when there are no
 * columns so callers can no-op instead of opening a quick-add for nothing.
 */
const resolveActiveColumnId = (
  focusedColumnId: string | null | undefined,
  hoveredColumnId: string | null | undefined,
  columns: ReadonlyArray<{ rowId: string }> | null | undefined,
): string | undefined =>
  focusedColumnId ?? hoveredColumnId ?? columns?.[0]?.rowId ?? undefined;

export default resolveActiveColumnId;
