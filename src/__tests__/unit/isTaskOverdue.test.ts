import { describe, expect, it } from "bun:test";

import { storedDueDateAtTime } from "@/lib/util/dueDate";
import isTaskOverdue from "@/lib/util/isTaskOverdue";

describe("isTaskOverdue", () => {
  const today = "2026-11-16";

  it("is overdue when due before today and not done", () => {
    expect(isTaskOverdue("2026-11-15T00:00:00.000Z", false, false, today)).toBe(
      true,
    );
  });

  it("is never overdue when done", () => {
    expect(isTaskOverdue("2026-11-15T00:00:00.000Z", false, true, today)).toBe(
      false,
    );
  });

  it("is not overdue when due today (all-day or timed)", () => {
    expect(isTaskOverdue("2026-11-16T00:00:00.000Z", false, false, today)).toBe(
      false,
    );
    expect(
      isTaskOverdue(storedDueDateAtTime(today, "01:00"), true, false, today),
    ).toBe(false);
  });

  it("is not overdue when due in the future", () => {
    expect(isTaskOverdue("2026-11-17T00:00:00.000Z", false, false, today)).toBe(
      false,
    );
  });

  it("is not overdue without a due date", () => {
    expect(isTaskOverdue(null, false, false, today)).toBe(false);
    expect(isTaskOverdue(undefined, true, false, today)).toBe(false);
  });

  it("defaults to the real current day", () => {
    expect(isTaskOverdue("2000-01-01T00:00:00.000Z", false, false)).toBe(true);
  });
});
