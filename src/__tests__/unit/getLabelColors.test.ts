import { describe, expect, it } from "bun:test";

import getLabelColors from "@/lib/util/getLabelColors";

describe("getLabelColors", () => {
  const red = "rgb(255, 0, 0)";

  describe("light mode (default)", () => {
    const channels = (color: string) =>
      color
        .replace(/[^\d,]/g, "")
        .split(",")
        .map(Number);

    const relativeLuminance = ([r, g, b]: number[]) => {
      const channel = (c: number) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };

    // Chip background is ~6% color over white, so contrast is measured vs white
    const contrastVsWhite = (color: string) =>
      1.05 / (relativeLuminance(channels(color)) + 0.05);

    it("returns subtle background opacity", () => {
      const { backgroundColor } = getLabelColors(red);
      expect(backgroundColor).toBe("rgba(255, 0, 0, 0.06)");
    });

    it("darkens text until it meets AA contrast on a light background", () => {
      // includes pale colors that were previously unreadable (the bug)
      for (const color of [
        "rgb(255, 0, 0)",
        "rgb(255, 255, 120)", // pale yellow
        "rgb(150, 220, 255)", // pale blue
        "rgb(120, 230, 120)", // pale green
        "rgb(0, 0, 0)",
      ]) {
        expect(
          contrastVsWhite(getLabelColors(color).textColor),
        ).toBeGreaterThanOrEqual(4.5);
      }
    });

    it("darkens a pale color more than an already-dark one", () => {
      const paleText = getLabelColors("rgb(255, 255, 150)").textColor;
      const darkText = getLabelColors("rgb(40, 40, 60)").textColor;
      // the pale color must be pulled well below the near-white background
      expect(relativeLuminance(channels(paleText))).toBeLessThan(0.4);
      // an already-dark color is left essentially unchanged
      expect(channels(darkText)).toEqual([40, 40, 60]);
    });
  });

  describe("dark mode", () => {
    it("returns higher background opacity", () => {
      const { backgroundColor } = getLabelColors(red, true);
      expect(backgroundColor).toBe("rgba(255, 0, 0, 0.2)");
    });

    it("lightens text color toward white", () => {
      const { textColor } = getLabelColors(red, true);
      // Red channel stays 255, green/blue get lightened
      expect(textColor).toContain("rgba(255,");
      expect(textColor).toContain(", 1)");
    });

    it("lightens dark colors more than light colors", () => {
      const dark = getLabelColors("rgb(50, 50, 50)", true);
      const light = getLabelColors("rgb(200, 200, 200)", true);

      // Extract green channel from both
      const darkG = Number.parseInt(dark.textColor.split(",")[1].trim());
      const lightG = Number.parseInt(light.textColor.split(",")[1].trim());

      // Dark color should be lightened more (moved further from original)
      expect(darkG - 50).toBeGreaterThan(lightG - 200);
    });
  });

  describe("various color formats", () => {
    it("handles rgb with spaces", () => {
      const result = getLabelColors("rgb(100, 150, 200)");
      expect(result.backgroundColor).toBe("rgba(100, 150, 200, 0.06)");
    });

    it("handles raw comma-separated values", () => {
      const result = getLabelColors("100,150,200");
      expect(result.backgroundColor).toBe("rgba(100, 150, 200, 0.06)");
    });
  });
});
