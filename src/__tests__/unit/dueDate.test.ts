import { afterEach, describe, expect, it } from "bun:test";

import { CalendarDate, parseAbsoluteToLocal } from "@internationalized/date";

import {
  allDayDueDate,
  dueDayKey,
  dueTimeValue,
  formatDueDate,
  pickedLocalDay,
  rescheduledDueDate,
  storedDueDateAtTime,
} from "@/lib/util/dueDate";

// Bun applies a runtime TZ change to Date, so each case pins the viewer's zone
const ORIGINAL_TZ = process.env.TZ;
const inZone = (zone: string) => {
  process.env.TZ = zone;
};
afterEach(() => {
  process.env.TZ = ORIGINAL_TZ;
});

describe("allDayDueDate", () => {
  it("is UTC midnight of the picked day", () => {
    expect(allDayDueDate("2026-11-20").toISOString()).toBe(
      "2026-11-20T00:00:00.000Z",
    );
  });

  it("uses only the leading date of a longer value", () => {
    expect(allDayDueDate("2026-11-20T15:30:00-06:00").toISOString()).toBe(
      "2026-11-20T00:00:00.000Z",
    );
  });

  it("is unaffected by a DST gap at local midnight", () => {
    // America/Santiago skips local midnight on 2026-09-06
    inZone("America/Santiago");
    expect(allDayDueDate("2026-09-06").toISOString()).toBe(
      "2026-09-06T00:00:00.000Z",
    );
    expect(formatDueDate(allDayDueDate("2026-09-06"), false)).toBe("Sep 6");
  });
});

describe("dueDayKey (all-day)", () => {
  it.each([
    "Europe/Berlin",
    "America/Chicago",
    "Asia/Tokyo",
    "Pacific/Honolulu",
  ])("reads a canonical value on its day for a viewer in %s", (zone) => {
    inZone(zone);
    expect(dueDayKey("2026-11-20T00:00:00.000Z", false)).toBe("2026-11-20");
  });

  it("resolves legacy local-midnight values to the picked day", () => {
    // Berlin midnight (UTC+1) and Chicago midnight (UTC-6) for Nov 20
    expect(dueDayKey("2026-11-19T23:00:00.000Z", false)).toBe("2026-11-20");
    expect(dueDayKey("2026-11-20T06:00:00.000Z", false)).toBe("2026-11-20");
    // Tokyo midnight (UTC+9)
    expect(dueDayKey("2026-11-19T15:00:00.000Z", false)).toBe("2026-11-20");
  });

  it("is null for a missing or unparseable value", () => {
    expect(dueDayKey(null, false)).toBeNull();
    expect(dueDayKey(undefined, true)).toBeNull();
    expect(dueDayKey("not-a-date", false)).toBeNull();
  });
});

describe("timed due dates", () => {
  it("round-trips a local time-of-day", () => {
    inZone("America/Chicago");
    const timed = storedDueDateAtTime("2026-10-15", "14:30");
    expect(dueDayKey(timed, true)).toBe("2026-10-15");
    expect(dueTimeValue(timed, true)).toBe("14:30");
    expect(formatDueDate(timed, true)).toBe("Oct 15, 2:30 PM");
    expect(formatDueDate(timed, true, { withYear: true })).toBe(
      "Oct 15, 2026, 2:30 PM",
    );
  });

  it("falls back to all-day on an invalid time", () => {
    expect(storedDueDateAtTime("2026-10-15", "not-a-time").toISOString()).toBe(
      "2026-10-15T00:00:00.000Z",
    );
  });
});

describe("the stored flag, not the local hour, decides all-day vs timed", () => {
  it("shows an all-day date as all-day to a viewer in any zone", () => {
    // a Chicago-picked legacy all-day value read in Berlin is 07:00 local, which
    // the old hour-based guess rendered as a timed "7:00 AM" on the right day
    inZone("Europe/Berlin");
    const legacyChicagoMidnight = "2026-11-20T06:00:00.000Z";
    expect(formatDueDate(legacyChicagoMidnight, false)).toBe("Nov 20");
    expect(dueTimeValue(legacyChicagoMidnight, false)).toBe("");
  });

  it("shows a timed date at midnight as timed", () => {
    inZone("America/Chicago");
    const midnight = storedDueDateAtTime("2026-11-20", "00:00");
    expect(formatDueDate(midnight, true)).toBe("Nov 20, 12:00 AM");
  });

  it("formats empty values as an empty string", () => {
    expect(formatDueDate(null, false)).toBe("");
    expect(formatDueDate(undefined, true)).toBe("");
  });
});

describe("rescheduledDueDate", () => {
  it("keeps a timed task's local time-of-day on the new day", () => {
    inZone("America/Chicago");
    const current = {
      dueDate: storedDueDateAtTime("2026-11-20", "14:00"),
      dueHasTime: true,
    };
    const next = rescheduledDueDate("2026-11-22", current);
    expect(next.dueHasTime).toBe(true);
    expect(dueDayKey(next.dueDate, true)).toBe("2026-11-22");
    expect(dueTimeValue(next.dueDate, true)).toBe("14:00");
  });

  it("keeps an all-day task all-day", () => {
    const next = rescheduledDueDate("2026-11-22", {
      dueDate: "2026-11-20T00:00:00.000Z",
      dueHasTime: false,
    });
    expect(next).toEqual({
      dueDate: new Date("2026-11-22T00:00:00.000Z"),
      dueHasTime: false,
    });
  });

  it("schedules an unscheduled task as all-day", () => {
    expect(
      rescheduledDueDate("2026-11-22", { dueDate: null, dueHasTime: false })
        .dueHasTime,
    ).toBe(false);
  });
});

describe("pickedLocalDay", () => {
  it("reduces a zoned picker value to its plain local day", () => {
    const zoned = parseAbsoluteToLocal("2026-11-20T06:00:00.000Z");
    expect(pickedLocalDay(zoned)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("passes a calendar date through unchanged", () => {
    expect(pickedLocalDay(new CalendarDate(2026, 11, 20))).toBe("2026-11-20");
  });
});
