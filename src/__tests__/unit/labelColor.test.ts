import { describe, expect, it } from "bun:test";

import { parseColor } from "@ark-ui/react/color-picker";

import getLabelColors from "@/lib/util/getLabelColors";

/**
 * Regression guard for the invisible-label bug: `Label` used to derive its
 * color through Ark's `useColorPicker` machine with a controlled value but no
 * `onValueChange`. After hydration the machine reverted to its default (white),
 * producing white text on the near-white task card. Deriving the color straight
 * from `parseColor(label.color)` keeps it deterministic across server and client.
 */
describe("label color derivation", () => {
  it("derives the stored color (not white) in light mode", () => {
    const color = parseColor("#e4a21b");
    const { textColor } = getLabelColors(color.toString("rgb"), false);

    expect(textColor).not.toBe("rgba(255, 255, 255)");
    expect(textColor).toBe("rgba(228, 162, 27)");
  });

  it("derives the stored color (not white) in dark mode", () => {
    const color = parseColor("#e4a21b");
    const { textColor } = getLabelColors(color.toString("rgb"), true);

    expect(textColor).not.toBe("rgba(255, 255, 255, 1)");
    expect(textColor).toContain("rgba(");
  });
});
