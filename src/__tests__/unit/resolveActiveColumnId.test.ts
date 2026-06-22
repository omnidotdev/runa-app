import { describe, expect, it } from "bun:test";

import resolveActiveColumnId from "@/lib/util/resolveActiveColumnId";

describe("resolveActiveColumnId", () => {
  const columns = [{ rowId: "col-1" }, { rowId: "col-2" }];

  it("prefers the focused column over the hovered column", () => {
    expect(resolveActiveColumnId("col-2", "col-1", columns)).toBe("col-2");
  });

  it("falls back to the hovered column when nothing is focused", () => {
    expect(resolveActiveColumnId(null, "col-1", columns)).toBe("col-1");
  });

  it("falls back to the first column when nothing is focused or hovered", () => {
    expect(resolveActiveColumnId(null, null, columns)).toBe("col-1");
  });

  it("returns undefined (never null) when there are no columns", () => {
    expect(resolveActiveColumnId(null, null, [])).toBeUndefined();
    expect(resolveActiveColumnId(null, null, undefined)).toBeUndefined();
  });
});
