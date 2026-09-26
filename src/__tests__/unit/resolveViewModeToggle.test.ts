import { describe, expect, it } from "bun:test";

import resolveViewModeToggle from "@/lib/util/resolveViewModeToggle";

describe("resolveViewModeToggle", () => {
  it("creates a preference row when none exists yet", () => {
    // No UserPreference row for this user+project (the common case: the row is
    // only created once a user hides a column). Toggling must CREATE, because
    // the update mutation requires a rowId and would fail otherwise.
    expect(resolveViewModeToggle(null)).toEqual({
      action: "create",
      viewMode: "list",
    });
    expect(resolveViewModeToggle(undefined)).toEqual({
      action: "create",
      viewMode: "list",
    });
  });

  it("updates the existing row when switching board to list", () => {
    expect(
      resolveViewModeToggle({ rowId: "row-1", viewMode: "board" }),
    ).toEqual({ action: "update", viewMode: "list" });
  });

  it("updates the existing row when switching list to board", () => {
    expect(resolveViewModeToggle({ rowId: "row-1", viewMode: "list" })).toEqual(
      { action: "update", viewMode: "board" },
    );
  });

  it("treats an unknown or missing viewMode as board and toggles to list", () => {
    expect(resolveViewModeToggle({ rowId: "row-1", viewMode: null })).toEqual({
      action: "update",
      viewMode: "list",
    });
  });
});
