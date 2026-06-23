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

  it("leaves image backgrounds unresolved without a base URL", () => {
    expect(
      resolveBackgroundStyle({ kind: "image", assetId: "abc" }),
    ).toBeUndefined();
  });

  it("resolves an image background to an optimized serve URL", () => {
    const style = resolveBackgroundStyle(
      { kind: "image", assetId: "runa/org/backgrounds/x.jpg", position: "top" },
      { assetBaseUrl: "https://api.example.com/" },
    );

    expect(style?.backgroundSize).toBe("cover");
    expect(style?.backgroundPosition).toBe("top");
    // trailing slash on the base is normalized, the key is encoded, and a
    // downscaled webp derivative is requested
    expect(style?.backgroundImage).toContain(
      'url("https://api.example.com/api/attachments/file/runa%2Forg%2Fbackgrounds%2Fx.jpg?w=1920&q=82&fm=webp")',
    );
  });
});
