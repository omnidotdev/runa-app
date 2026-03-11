import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { canUndoLocally } from "../useUndoActivity";

describe("canUndoLocally", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("returns canUndo false with reason 'Already undone' for rolled_back status", () => {
    const result = canUndoLocally({
      activityCreatedAt: new Date().toISOString(),
      activityStatus: "rolled_back",
      hasSnapshot: true,
    });

    expect(result).toEqual({ canUndo: false, reason: "Already undone" });
  });

  test("returns canUndo false with reason 'Not completed' for non-completed status", () => {
    const result = canUndoLocally({
      activityCreatedAt: new Date().toISOString(),
      activityStatus: "failed",
      hasSnapshot: true,
    });

    expect(result).toEqual({ canUndo: false, reason: "Not completed" });
  });

  test("returns canUndo false with reason 'Not completed' for denied status", () => {
    const result = canUndoLocally({
      activityCreatedAt: new Date().toISOString(),
      activityStatus: "denied",
      hasSnapshot: true,
    });

    expect(result).toEqual({ canUndo: false, reason: "Not completed" });
  });

  test("returns canUndo false with reason 'Cannot undo' when no snapshot", () => {
    const result = canUndoLocally({
      activityCreatedAt: new Date().toISOString(),
      activityStatus: "completed",
      hasSnapshot: false,
    });

    expect(result).toEqual({ canUndo: false, reason: "Cannot undo" });
  });

  test("returns canUndo false with reason 'Expired' when elapsed >= 5 minutes", () => {
    // Set time to 6 minutes ago
    const sixMinutesAgo = new Date(Date.now() - 6 * 60 * 1000).toISOString();

    const result = canUndoLocally({
      activityCreatedAt: sixMinutesAgo,
      activityStatus: "completed",
      hasSnapshot: true,
    });

    expect(result).toEqual({ canUndo: false, reason: "Expired" });
  });

  test("returns canUndo true with remainingSeconds within 5-minute window", () => {
    // Set time to 2 minutes ago
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();

    const result = canUndoLocally({
      activityCreatedAt: twoMinutesAgo,
      activityStatus: "completed",
      hasSnapshot: true,
    });

    expect(result.canUndo).toBe(true);
    expect(result.remainingSeconds).toBeDefined();
    expect(result.remainingSeconds).toBeGreaterThan(0);
    expect(result.remainingSeconds).toBeLessThanOrEqual(180); // 3 minutes
  });

  test("returns remainingSeconds that decreases as time passes", () => {
    const now = new Date("2026-03-11T10:00:00Z");
    vi.setSystemTime(now);

    const result1 = canUndoLocally({
      activityCreatedAt: now.toISOString(),
      activityStatus: "completed",
      hasSnapshot: true,
    });

    // Advance 1 minute
    vi.setSystemTime(new Date("2026-03-11T10:01:00Z"));

    const result2 = canUndoLocally({
      activityCreatedAt: now.toISOString(),
      activityStatus: "completed",
      hasSnapshot: true,
    });

    expect(result1.canUndo).toBe(true);
    expect(result2.canUndo).toBe(true);
    expect(result2.remainingSeconds!).toBeLessThan(result1.remainingSeconds!);
  });

  test("returns canUndo false at exactly 5 minutes", () => {
    const now = new Date("2026-03-11T10:00:00Z");
    vi.setSystemTime(now);

    // Advance exactly 5 minutes
    vi.setSystemTime(new Date("2026-03-11T10:05:00Z"));

    const result = canUndoLocally({
      activityCreatedAt: now.toISOString(),
      activityStatus: "completed",
      hasSnapshot: true,
    });

    expect(result.canUndo).toBe(false);
    expect(result.reason).toBe("Expired");
  });
});
