import { describe, expect, it } from "bun:test";

import dayjs from "dayjs";

import isTaskOverdue from "@/lib/util/isTaskOverdue";

describe("isTaskOverdue", () => {
  const yesterday = dayjs().subtract(1, "day").toISOString();
  const tomorrow = dayjs().add(1, "day").toISOString();
  const earlierToday = dayjs().startOf("day").add(1, "hour").toISOString();

  it("is overdue when due before today and not done", () => {
    expect(isTaskOverdue(yesterday, false)).toBe(true);
  });

  it("is never overdue when done", () => {
    expect(isTaskOverdue(yesterday, true)).toBe(false);
  });

  it("is not overdue when due today", () => {
    expect(isTaskOverdue(earlierToday, false)).toBe(false);
  });

  it("is not overdue when due in the future", () => {
    expect(isTaskOverdue(tomorrow, false)).toBe(false);
  });

  it("is not overdue without a due date", () => {
    expect(isTaskOverdue(null, false)).toBe(false);
    expect(isTaskOverdue(undefined, false)).toBe(false);
  });
});
