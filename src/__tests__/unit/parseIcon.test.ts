import { describe, expect, it } from "bun:test";

import parseIcon from "@/lib/util/parseIcon";

describe("parseIcon", () => {
  describe("valid icons", () => {
    it("parses emoji icon", () => {
      expect(parseIcon("emoji:🐛")).toEqual({ type: "emoji", value: "🐛" });
    });

    it("parses lucide icon", () => {
      expect(parseIcon("lucide:bug")).toEqual({ type: "lucide", value: "bug" });
    });

    it("handles values with colons", () => {
      expect(parseIcon("emoji:🎉:extra")).toEqual({
        type: "emoji",
        value: "🎉:extra",
      });
    });
  });

  describe("invalid icons", () => {
    it("returns null for null", () => {
      expect(parseIcon(null)).toBeNull();
    });

    it("returns null for undefined", () => {
      expect(parseIcon(undefined)).toBeNull();
    });

    it("returns null for empty string", () => {
      expect(parseIcon("")).toBeNull();
    });

    it("returns null for string without colon", () => {
      expect(parseIcon("emoji")).toBeNull();
    });

    it("returns null for unknown provider", () => {
      expect(parseIcon("fontawesome:star")).toBeNull();
    });

    it("returns null for empty value after colon", () => {
      expect(parseIcon("emoji:")).toBeNull();
    });
  });
});
