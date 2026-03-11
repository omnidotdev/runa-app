import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { formatRelativeTime } from "../formatRelativeTime";

describe("formatRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-11T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("formats date string as relative time", () => {
    const fiveMinutesAgo = "2026-03-11T11:55:00Z";
    expect(formatRelativeTime(fiveMinutesAgo)).toBe("5 minutes ago");
  });

  test("formats Date object as relative time", () => {
    const tenMinutesAgo = new Date("2026-03-11T11:50:00Z");
    expect(formatRelativeTime(tenMinutesAgo)).toBe("10 minutes ago");
  });

  test("formats hours ago", () => {
    const twoHoursAgo = "2026-03-11T10:00:00Z";
    expect(formatRelativeTime(twoHoursAgo)).toBe("2 hours ago");
  });

  test("formats recent time as seconds ago", () => {
    const thirtySecondsAgo = "2026-03-11T11:59:30Z";
    expect(formatRelativeTime(thirtySecondsAgo)).toBe("a few seconds ago");
  });

  test("formats days ago", () => {
    const yesterday = "2026-03-10T12:00:00Z";
    expect(formatRelativeTime(yesterday)).toBe("a day ago");
  });
});
