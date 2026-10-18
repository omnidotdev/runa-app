import dayjs from "dayjs";

/**
 * Whether a task reads as overdue: it has a due date in the past and is not
 * done. Compared at local day granularity to match how the calendar buckets a
 * task onto a day, so a task due earlier today is not overdue, only one due
 * before today is. A done task is never overdue, whatever its due date.
 */
const isTaskOverdue = (
  dueDate: string | Date | null | undefined,
  isDone: boolean,
): boolean => {
  if (isDone || !dueDate) return false;
  return dayjs(dueDate).isBefore(dayjs().startOf("day"));
};

export default isTaskOverdue;
