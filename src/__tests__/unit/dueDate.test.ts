import { describe, expect, it } from "bun:test";

import dayjs from "dayjs";

import { storedDueDate } from "@/lib/util/dueDate";

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
