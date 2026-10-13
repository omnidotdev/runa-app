/**
 * Pure date helpers for the task calendar view. Day bucketing uses the SAME
 * local-day interpretation the board/list cards already use to render a due
 * date (`dayjs(dueDate).format(...)`), so a task appears on the calendar on the
 * exact day its card shows. Writes round-trip through the same interpretation.
 */

import dayjs from "dayjs";

/** One cell in the month grid. */
export interface CalendarDay {
  /** Local day key, `YYYY-MM-DD`. */
  key: string;
  /** Day of month (1-31). */
  dayOfMonth: number;
  /** Whether the day belongs to the month being viewed (vs. a padding day). */
  inMonth: boolean;
  /** Whether the day is today (local). */
  isToday: boolean;
}

/**
 * A fixed 6x7 month grid covering `viewDate`'s month, padded with the trailing
 * days of the previous month and leading days of the next so every week is
 * full. `weekStartsOn` is 0 (Sunday) by default.
 */
export const buildMonthGrid = (
  viewDate: string | Date,
  weekStartsOn: 0 | 1 = 0,
): CalendarDay[][] => {
  const month = dayjs(viewDate);
  const firstOfMonth = month.startOf("month");
  // back up to the first `weekStartsOn` on/before the 1st
  const offset = (firstOfMonth.day() - weekStartsOn + 7) % 7;
  const gridStart = firstOfMonth.subtract(offset, "day");
  const today = dayjs();

  const weeks: CalendarDay[][] = [];
  let cursor = gridStart;
  for (let w = 0; w < 6; w++) {
    const week: CalendarDay[] = [];
    for (let d = 0; d < 7; d++) {
      week.push({
        key: cursor.format("YYYY-MM-DD"),
        dayOfMonth: cursor.date(),
        inMonth: cursor.month() === month.month(),
        isToday: cursor.isSame(today, "day"),
      });
      cursor = cursor.add(1, "day");
    }
    weeks.push(week);
  }
  return weeks;
};

/** The local day key a due date falls on, or null when unset. */
export const taskDueDayKey = (
  dueDate: string | Date | null | undefined,
): string | null => (dueDate ? dayjs(dueDate).format("YYYY-MM-DD") : null);

/** Group tasks by their due day key; tasks without a due date are omitted. */
export const bucketTasksByDay = <T extends { dueDate?: string | Date | null }>(
  tasks: readonly T[],
): Record<string, T[]> => {
  const byDay: Record<string, T[]> = {};
  for (const task of tasks) {
    const key = taskDueDayKey(task.dueDate);
    if (!key) continue;
    const bucket = byDay[key] ?? [];
    bucket.push(task);
    byDay[key] = bucket;
  }
  return byDay;
};

/**
 * The due-date value to store when a task is dropped on a calendar day. Local
 * start-of-day, so it renders back on that same day via `dayjs(...).format`.
 */
export const dueDateForCalendarDay = (dayKey: string): Date =>
  dayjs(dayKey).startOf("day").toDate();

/** A resolved calendar reschedule: move `taskId` to the day `dayKey`. */
export interface CalendarDrop {
  taskId: string;
  dayKey: string;
}

/**
 * Turn a drag result (droppable ids are day keys) into a reschedule, or null
 * when the drop was cancelled or landed back on the same day. Pure, so the drop
 * decision is testable without driving the drag library.
 */
export const resolveCalendarDrop = (result: {
  draggableId: string;
  source: { droppableId: string };
  destination?: { droppableId: string } | null;
}): CalendarDrop | null => {
  const destination = result.destination;
  if (!destination || destination.droppableId === result.source.droppableId) {
    return null;
  }
  return { taskId: result.draggableId, dayKey: destination.droppableId };
};
