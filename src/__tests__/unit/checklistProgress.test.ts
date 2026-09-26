import { describe, expect, it } from "bun:test";

import checklistProgress from "@/lib/util/checklistProgress";

describe("checklistProgress", () => {
  it("returns zeroes for no checklists", () => {
    expect(checklistProgress(null)).toEqual({ done: 0, total: 0 });
    expect(checklistProgress(undefined)).toEqual({ done: 0, total: 0 });
    expect(checklistProgress([])).toEqual({ done: 0, total: 0 });
  });

  it("sums done and total across every checklist on the task", () => {
    const checklists = [
      {
        checklistItems: { totalCount: 3 },
        doneItems: { totalCount: 2 },
      },
      {
        checklistItems: { totalCount: 2 },
        doneItems: { totalCount: 0 },
      },
    ];
    expect(checklistProgress(checklists)).toEqual({ done: 2, total: 5 });
  });

  it("counts a fully complete checklist", () => {
    expect(
      checklistProgress([
        { checklistItems: { totalCount: 4 }, doneItems: { totalCount: 4 } },
      ]),
    ).toEqual({ done: 4, total: 4 });
  });
});
