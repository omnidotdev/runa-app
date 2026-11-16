import dayjs from "dayjs";

import { dueDayKey } from "@/lib/util/dueDate";

import type { DueValue } from "@/lib/util/dueDate";

/**
 * Whether a task reads as overdue: it has a due date in the past and is not
 * done. Compared at day granularity (the same day the calendar buckets it on),
 * so a task due today is not overdue, only one due before today is. A done task
 * is never overdue, whatever its due date.
 */
const isTaskOverdue = (
  dueDate: DueValue,
  dueHasTime: boolean | null | undefined,
  isDone: boolean,
  today: string = dayjs().format("YYYY-MM-DD"),
): boolean => {
  if (isDone) return false;
  const day = dueDayKey(dueDate, dueHasTime);
  // day keys are zero-padded ISO dates, so string order is date order
  return !!day && day < today;
};

export default isTaskOverdue;
