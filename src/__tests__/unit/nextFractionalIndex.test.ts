import { describe, expect, it } from "bun:test";

import { compareKeys } from "@/lib/util/fractionalKey";
import nextFractionalIndex from "@/lib/util/nextFractionalIndex";

describe("nextFractionalIndex", () => {
  it("returns a valid first key when the list is empty", () => {
    const key = nextFractionalIndex([]);
    expect(key.length).toBeGreaterThan(0);
    expect(nextFractionalIndex(null).length).toBeGreaterThan(0);
    expect(nextFractionalIndex(undefined).length).toBeGreaterThan(0);
  });

  it("returns a key that sorts after the current maximum", () => {
    const existing = [{ index: "a0" }, { index: "a1" }, { index: "a2" }];
    const key = nextFractionalIndex(existing);
    expect(compareKeys(key, "a2")).toBeGreaterThan(0);
  });

  it("appends after the true maximum even when input is unordered", () => {
    const existing = [{ index: "a2" }, { index: "a0" }, { index: "a1" }];
    const key = nextFractionalIndex(existing);
    for (const { index } of existing) {
      expect(compareKeys(key, index)).toBeGreaterThan(0);
    }
  });
});
