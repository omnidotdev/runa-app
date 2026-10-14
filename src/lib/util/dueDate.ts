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
