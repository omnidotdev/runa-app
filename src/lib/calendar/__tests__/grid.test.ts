import { describe, expect, test } from "bun:test";

import dayjs from "dayjs";

import {
  bucketTasksByDay,
  buildMonthGrid,
  dueDateForCalendarDay,
  resolveCalendarDrop,
  taskDueDayKey,
} from "@/lib/calendar/grid";

describe("buildMonthGrid", () => {
  const grid = buildMonthGrid("2026-10-15", 0);

  test("is a fixed 6x7 grid", () => {
    expect(grid).toHaveLength(6);
    for (const week of grid) expect(week).toHaveLength(7);
  });

  test("starts on the Sunday on/before the 1st and is contiguous", () => {
    // Oct 1 2026 is a Thursday, so the grid starts Sun Sep 27
    expect(grid[0]![0]!.key).toBe("2026-09-27");
    const flat = grid.flat();
    for (let i = 1; i < flat.length; i++) {
      expect(dayjs(flat[i]!.key).diff(dayjs(flat[i - 1]!.key), "day")).toBe(1);
    }
  });

  test("marks in-month days correctly (October has 31)", () => {
    expect(grid.flat().filter((d) => d.inMonth)).toHaveLength(31);
    const first = grid.flat().find((d) => d.key === "2026-10-01");
    expect(first?.inMonth).toBe(true);
    expect(grid.flat().find((d) => d.key === "2026-09-30")?.inMonth).toBe(
      false,
    );
  });

  test("week can start on Monday", () => {
    // Monday on/before Oct 1 2026 (Thu) is Mon Sep 28
    expect(buildMonthGrid("2026-10-15", 1)[0]![0]!.key).toBe("2026-09-28");
  });
});

describe("taskDueDayKey", () => {
  test("returns null for an unset due date", () => {
    expect(taskDueDayKey(null)).toBeNull();
    expect(taskDueDayKey(undefined)).toBeNull();
  });

  test("returns the local day key for a due date", () => {
    expect(taskDueDayKey("2026-10-15T12:00:00")).toBe("2026-10-15");
  });
});

describe("bucketTasksByDay", () => {
  test("groups by due day and omits undated tasks", () => {
    const tasks = [
      { id: "a", dueDate: "2026-10-15T09:00:00" },
      { id: "b", dueDate: "2026-10-15T18:00:00" },
      { id: "c", dueDate: "2026-10-16T09:00:00" },
      { id: "d", dueDate: null },
    ];
    const byDay = bucketTasksByDay(tasks);
    expect(byDay["2026-10-15"]?.map((t) => t.id)).toEqual(["a", "b"]);
    expect(byDay["2026-10-16"]?.map((t) => t.id)).toEqual(["c"]);
    expect(Object.keys(byDay)).toHaveLength(2);
  });
});

describe("dueDateForCalendarDay", () => {
  test("round-trips: a dropped day renders back as that day", () => {
    const stored = dueDateForCalendarDay("2026-10-15");
    expect(taskDueDayKey(stored)).toBe("2026-10-15");
    expect(dayjs(stored).format("MMM D")).toBe("Oct 15");
  });
});

describe("resolveCalendarDrop", () => {
  test("resolves a drop onto a different day", () => {
    expect(
      resolveCalendarDrop({
        draggableId: "t1",
        source: { droppableId: "2026-10-15" },
        destination: { droppableId: "2026-10-20" },
      }),
    ).toEqual({ taskId: "t1", dayKey: "2026-10-20" });
  });

  test("ignores a cancelled drop or a drop on the same day", () => {
    expect(
      resolveCalendarDrop({
        draggableId: "t1",
        source: { droppableId: "2026-10-15" },
        destination: null,
      }),
    ).toBeNull();
    expect(
      resolveCalendarDrop({
        draggableId: "t1",
        source: { droppableId: "2026-10-15" },
        destination: { droppableId: "2026-10-15" },
      }),
    ).toBeNull();
  });
});
