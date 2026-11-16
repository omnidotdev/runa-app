import { toCalendarDate } from "@internationalized/date";
import dayjs from "dayjs";

import type { DateValue } from "@internationalized/date";

/**
 * The local day (`YYYY-MM-DD`) a date picker selection represents. The picker is
 * seeded with a zoned value (`parseAbsoluteToLocal`), so a pick can come back as
 * a ZonedDateTime whose `toString()` is `2026-11-20T00:00:00-06:00[America/Chicago]`,
 * which dayjs cannot parse (it became an Invalid Date, saved as a null due date
 * and crashed the page). Converting to a calendar date first always yields a
 * plain day
 */
export const pickedLocalDay = (value: DateValue): string =>
  toCalendarDate(value).toString();

/** A task's stored due date: an instant plus whether it carries a time. */
export type DueValue = string | Date | null | undefined;

/** Half a day, the tolerance for reading an all-day value back to its day. */
const HALF_DAY_MS = 12 * 60 * 60 * 1000;

/**
 * The value to store for an all-day due date picked as a day (`YYYY-MM-DD`, or
 * a longer ISO string whose leading date is the day): UTC midnight of that day.
 * Pair it with `dueHasTime: false`.
 *
 * All-day dates are pinned to UTC (not the picker's local midnight) so the day
 * survives every reader: a teammate in another timezone, the server-side iCal
 * feed, and DST transitions that skip local midnight. Readers derive the day
 * with {@link dueDayKey}, never by formatting the instant in local time.
 */
export const allDayDueDate = (day: string): Date =>
  new Date(`${day.slice(0, 10)}T00:00:00.000Z`);

/**
 * The value to store for a timed due date: the local day combined with `HH:mm`,
 * as the instant that wall-clock time denotes here. Pair it with
 * `dueHasTime: true`. An invalid time falls back to the all-day value
 */
export const storedDueDateAtTime = (day: string, time: string): Date => {
  const parsed = dayjs(`${day.slice(0, 10)}T${time}`);
  return parsed.isValid() ? parsed.toDate() : allDayDueDate(day);
};

/**
 * The calendar day (`YYYY-MM-DD`) a due date falls on. A timed due date is the
 * local day of its instant. An all-day date is the UTC date of its nearest UTC
 * midnight, which reads canonical values (`T00:00Z`) exactly and still resolves
 * legacy values (stored at a creator's local midnight, UTC-11 to UTC+12) to the
 * day they were picked on.
 */
export const dueDayKey = (
  dueDate: DueValue,
  hasTime: boolean | null | undefined,
): string | null => {
  if (!dueDate) return null;
  const instant = new Date(dueDate).getTime();
  if (Number.isNaN(instant)) return null;
  if (hasTime) return dayjs(instant).format("YYYY-MM-DD");
  return new Date(instant + HALF_DAY_MS).toISOString().slice(0, 10);
};

/** `HH:mm` (local) of a timed due date, for seeding a time input. */
export const dueTimeValue = (
  dueDate: DueValue,
  hasTime: boolean | null | undefined,
): string => (dueDate && hasTime ? dayjs(dueDate).format("HH:mm") : "");

/**
 * Human label for a due date: `MMM D` for an all-day date, `MMM D, h:mm A` for
 * a timed one (pass `withYear` for the longer task-panel form). Single source of
 * truth for rendering due dates on cards, the task panel, and calendar chips.
 */
export const formatDueDate = (
  dueDate: DueValue,
  hasTime: boolean | null | undefined,
  { withYear = false }: { withYear?: boolean } = {},
): string => {
  const day = dueDayKey(dueDate, hasTime);
  if (!day) return "";
  const date = withYear ? "MMM D, YYYY" : "MMM D";
  return hasTime
    ? dayjs(dueDate).format(`${date}, h:mm A`)
    : dayjs(day).format(date);
};

/**
 * The due value after moving a task to another day (calendar drag): a timed
 * task keeps its local time-of-day, an all-day task stays all-day.
 */
export const rescheduledDueDate = (
  day: string,
  current: { dueDate: DueValue; dueHasTime: boolean | null | undefined },
): { dueDate: Date; dueHasTime: boolean } => {
  const time = dueTimeValue(current.dueDate, current.dueHasTime);
  return time
    ? { dueDate: storedDueDateAtTime(day, time), dueHasTime: true }
    : { dueDate: allDayDueDate(day), dueHasTime: false };
};
