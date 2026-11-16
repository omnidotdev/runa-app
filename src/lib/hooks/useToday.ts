import dayjs from "dayjs";
import { useEffect, useState } from "react";

/** Local day key for now. */
const todayKey = () => dayjs().format("YYYY-MM-DD");

/**
 * Today's local day (`YYYY-MM-DD`), re-rendering at local midnight so anything
 * derived from it (overdue state) rolls over on a tab left open overnight.
 */
const useToday = (): string => {
  const [today, setToday] = useState(todayKey);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-arm the timer each time the day rolls over
  useEffect(() => {
    const msUntilMidnight = dayjs().add(1, "day").startOf("day").diff(dayjs());
    // a small buffer so the timer never fires a hair before midnight
    const timer = setTimeout(
      () => setToday(todayKey()),
      msUntilMidnight + 1000,
    );
    return () => clearTimeout(timer);
  }, [today]);

  return today;
};

export default useToday;
