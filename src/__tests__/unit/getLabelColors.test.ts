import { describe, expect, it } from "bun:test";

import getLabelColors from "@/lib/util/getLabelColors";

describe("getLabelColors", () => {
  const red = "rgb(255, 0, 0)";

  describe("light mode (default)", () => {
    it("returns subtle background opacity", () => {
      const { backgroundColor } = getLabelColors(red);
      expect(backgroundColor).toBe("rgba(255, 0, 0, 0.06)");
    });

    it("returns full color text", () => {
      const { textColor } = getLabelColors(red);
      expect(textColor).toBe("rgba(255, 0, 0)");
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
