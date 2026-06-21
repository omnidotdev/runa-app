/**
 * Resolve which project column a new project should be created in.
 *
 * Prefers an explicit selection, otherwise the first available column. Returns
 * `undefined` (never `null`) when the workspace has no columns yet, so callers
 * surface an actionable message instead of submitting a null column id, which
 * the API rejects with an opaque error.
 */
const resolveProjectColumnId = (
  explicit: string | null | undefined,
  columns: ReadonlyArray<{ rowId: string }> | null | undefined,
): string | undefined => explicit ?? columns?.[0]?.rowId ?? undefined;

export default resolveProjectColumnId;
