import dayjs from "dayjs";

/**
 * The value to store for a due date picked as a local day (`YYYY-MM-DD`, or a
 * longer ISO string whose leading date is the local day). Local start-of-day,
 * so cards and the calendar (both of which read it back with `dayjs(...).format`
 * in local time) show it on that same day in every timezone.
 *
 * This replaces an earlier hack that stored a UTC-midnight Date one day ahead to
 * offset the UTC->local backshift; that only read back correctly west of UTC and
 * showed the next day east of it. Every due-date write path goes through here.
 */
export const storedDueDate = (localDay: string): Date =>
  dayjs(localDay).startOf("day").toDate();

/**
 * The value to store for a due date with a time-of-day: the local day combined
 * with `HH:mm`. A non-midnight local time is how a due date is recognized as
 * "timed" (see {@link dueHasTime}); clearing the time stores start-of-day again
 * via {@link storedDueDate}, making the task all-day.
 */
export const storedDueDateAtTime = (localDay: string, time: string): Date => {
  const day = dayjs(localDay).format("YYYY-MM-DD");
  const parsed = dayjs(`${day}T${time}`);
  return parsed.isValid() ? parsed.toDate() : storedDueDate(localDay);
};

/**
 * Whether a stored due date carries a time-of-day. All-day due dates are stored
 * at local start-of-day (midnight), so any non-midnight local time is treated
 * as a timed due date.
 */
export const dueHasTime = (
  dueDate: string | Date | null | undefined,
): boolean => {
  if (!dueDate) return false;
  const d = dayjs(dueDate);
  return d.hour() !== 0 || d.minute() !== 0;
};

/** `HH:mm` (local) of a stored due date, for seeding a time input. */
export const dueTimeValue = (
  dueDate: string | Date | null | undefined,
): string =>
  dueDate && dueHasTime(dueDate) ? dayjs(dueDate).format("HH:mm") : "";

/**
 * Human label for a due date: `MMM D` for an all-day date, `MMM D, h:mm A` when
 * it carries a time. Single source of truth for rendering due dates on cards,
 * the task panel, and calendar chips.
 */
export const formatDueDate = (
  dueDate: string | Date | null | undefined,
): string => {
  if (!dueDate) return "";
  return dayjs(dueDate).format(dueHasTime(dueDate) ? "MMM D, h:mm A" : "MMM D");
};
