import { describe, expect, it } from "bun:test";

import dayjs from "dayjs";

import {
  dueHasTime,
  dueTimeValue,
  formatDueDate,
  storedDueDate,
  storedDueDateAtTime,
} from "@/lib/util/dueDate";

describe("storedDueDate", () => {
  it("stores the picked local day so it reads back on the same day (no +1)", () => {
    // the old write added 1 day to a UTC-midnight Date to compensate for the
    // UTC->local backshift; that only worked west of UTC. storedDueDate reads
    // back on the picked day in every timezone because it is local start-of-day
    const stored = storedDueDate("2026-10-15");
    expect(dayjs(stored).format("YYYY-MM-DD")).toBe("2026-10-15");
    expect(dayjs(stored).format("MMM D")).toBe("Oct 15");
  });

  it("is local start-of-day", () => {
    const stored = storedDueDate("2026-10-15");
    expect(stored.getHours()).toBe(0);
    expect(stored.getMinutes()).toBe(0);
    expect(stored.getSeconds()).toBe(0);
  });

  it("accepts the date portion of a longer value", () => {
    expect(dayjs(storedDueDate("2026-01-03")).format("YYYY-MM-DD")).toBe(
      "2026-01-03",
    );
  });
});

describe("timed due dates", () => {
  it("all-day (start-of-day) has no time", () => {
    const allDay = storedDueDate("2026-10-15");
    expect(dueHasTime(allDay)).toBe(false);
    expect(dueTimeValue(allDay)).toBe("");
    expect(formatDueDate(allDay)).toBe("Oct 15");
  });

  it("a time-of-day is recognized and formatted", () => {
    const timed = storedDueDateAtTime("2026-10-15", "14:30");
    expect(dueHasTime(timed)).toBe(true);
    expect(dueTimeValue(timed)).toBe("14:30");
    expect(dayjs(timed).format("YYYY-MM-DD")).toBe("2026-10-15");
    expect(formatDueDate(timed)).toBe("Oct 15, 2:30 PM");
  });

  it("falls back to all-day on an invalid time", () => {
    const stored = storedDueDateAtTime("2026-10-15", "not-a-time");
    expect(dueHasTime(stored)).toBe(false);
  });

  it("null/undefined format to empty string", () => {
    expect(formatDueDate(null)).toBe("");
    expect(formatDueDate(undefined)).toBe("");
    expect(dueHasTime(null)).toBe(false);
  });
});
