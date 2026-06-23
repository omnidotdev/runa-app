import { describe, expect, it } from "bun:test";

import {
  backgroundPresets,
  resolveBackgroundStyle,
} from "@/lib/constants/backgrounds";

import type { ProjectBackground } from "@/lib/constants/backgrounds";

describe("resolveBackgroundStyle", () => {
  it("returns undefined for the neutral default", () => {
    expect(resolveBackgroundStyle(null)).toBeUndefined();
    expect(resolveBackgroundStyle(undefined)).toBeUndefined();
  });

  it("resolves every curated preset to its CSS background", () => {
    for (const preset of backgroundPresets) {
      const background = {
        kind: preset.kind,
        token: preset.id,
      } as ProjectBackground;
      expect(resolveBackgroundStyle(background)).toEqual({
        background: preset.css,
      });
    }
  });

  it("falls back to neutral for an unknown token", () => {
    expect(
      resolveBackgroundStyle({ kind: "solid", token: "does-not-exist" }),
    ).toBeUndefined();
  });

  it("does not yet resolve image backgrounds", () => {
    expect(
      resolveBackgroundStyle({ kind: "image", assetId: "abc" }),
    ).toBeUndefined();
  });
});
