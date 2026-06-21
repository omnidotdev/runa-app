import { describe, expect, it } from "bun:test";

import resolveProjectColumnId from "@/lib/util/resolveProjectColumnId";

describe("resolveProjectColumnId", () => {
  it("prefers an explicit selection", () => {
    expect(resolveProjectColumnId("col-1", [{ rowId: "col-2" }])).toBe("col-1");
  });

  it("falls back to the first available column", () => {
    expect(
      resolveProjectColumnId(null, [{ rowId: "col-2" }, { rowId: "col-3" }]),
    ).toBe("col-2");
  });

  it("returns undefined (never null) when there are no columns", () => {
    expect(resolveProjectColumnId(null, [])).toBeUndefined();
    expect(resolveProjectColumnId(null, undefined)).toBeUndefined();
    expect(resolveProjectColumnId(undefined, null)).toBeUndefined();
  });
});
