interface ActivityEntry {
  id?: string | null;
  action?: string | null;
  actorName?: string | null;
  relativeTime?: string | null;
}

interface ActivityGroup {
  /** id of the newest entry in the run. */
  id: string;
  actorName: string | null;
  /** Friendly, task-relative verb (the task identity is not restated). */
  verb: string;
  /** How many consecutive events this row collapses. */
  count: number;
  /** Relative time of the newest event in the run. */
  relativeTime: string | null;
}

// Map a `<entity>.<action>` event type to a friendly, task-relative phrase.
// Related actions collapse to one verb (assign/unassign, label add/remove) so a
// run of them merges into a single row.
const VERBS: Record<string, string> = {
  "task.created": "created this task",
  "task.updated": "updated this task",
  "task.deleted": "deleted this task",
  "post.created": "commented",
  "post.updated": "edited a comment",
  "post.deleted": "deleted a comment",
  "assignee.created": "changed assignees",
  "assignee.deleted": "changed assignees",
  "task_label.created": "changed labels",
  "task_label.deleted": "changed labels",
  "attachment.created": "added an attachment",
  "attachment.deleted": "removed an attachment",
};

const verbFor = (action: string | null | undefined): string =>
  (action && VERBS[action]) ?? "updated this task";

/**
 * Collapse a task's activity (newest first) into display rows: consecutive
 * events by the same actor with the same friendly verb become one row with a
 * count. Keeps the feed readable on a per-task view, where restating the task
 * on every row and listing every debounced `task.updated` is just noise
 */
const groupActivity = (
  entries: ReadonlyArray<ActivityEntry>,
): ActivityGroup[] => {
  const groups: ActivityGroup[] = [];

  for (const entry of entries) {
    const verb = verbFor(entry.action);
    const last = groups[groups.length - 1];

    if (last && last.verb === verb && last.actorName === entry.actorName) {
      last.count += 1;
      continue;
    }

    groups.push({
      id: entry.id ?? String(groups.length),
      actorName: entry.actorName ?? null,
      verb,
      count: 1,
      relativeTime: entry.relativeTime ?? null,
    });
  }

  return groups;
};

export default groupActivity;
