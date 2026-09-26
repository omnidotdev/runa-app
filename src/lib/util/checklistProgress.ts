interface ChecklistCounts {
  checklistItems: { totalCount: number };
  doneItems: { totalCount: number };
}

/**
 * Sum a task's checklist completion into `{ done, total }` item counts, for the
 * board-card progress badge. Reads the aggregated counts shape from the Task
 * fragment (each checklist carries `checklistItems.totalCount` and a filtered
 * `doneItems.totalCount`)
 */
const checklistProgress = (
  checklists: ReadonlyArray<ChecklistCounts> | null | undefined,
): { done: number; total: number } =>
  (checklists ?? []).reduce(
    (acc, checklist) => ({
      done: acc.done + (checklist.doneItems?.totalCount ?? 0),
      total: acc.total + (checklist.checklistItems?.totalCount ?? 0),
    }),
    { done: 0, total: 0 },
  );

export default checklistProgress;
