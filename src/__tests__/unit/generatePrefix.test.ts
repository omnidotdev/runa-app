import { describe, expect, it } from "bun:test";

import generatePrefix from "@/lib/util/generatePrefix";

describe("generatePrefix", () => {
  describe("multi-word names", () => {
    it("extends 2-letter acronym from first word", () => {
      // "PM" is only 2 chars (< 3 min), so it extends from first word
      expect(generatePrefix("Project Management")).toBe("PRO");
    });

    it("takes first letter of three words", () => {
      expect(generatePrefix("My Cool Project")).toBe("MCP");
    });

    it("extends short acronyms from first word when possible", () => {
      // Two-letter acronym "AB" < 3 chars, first word "Alpha" >= 3 chars
      expect(generatePrefix("Alpha Beta")).toBe("ALP");
    });

    it("keeps short acronym when first word is too short", () => {
      expect(generatePrefix("Go Do")).toBe("GD");
    });
  });

  describe("single-word names", () => {
    it("takes first 4 characters", () => {
      expect(generatePrefix("Backlog")).toBe("BACK");
    });

    it("handles short words", () => {
      expect(generatePrefix("Go")).toBe("GO");
    });

    it("handles exactly 4 character words", () => {
      expect(generatePrefix("Task")).toBe("TASK");
    });
  });

  describe("casing", () => {
    it("always returns uppercase", () => {
      // "HW" is only 2 chars, extended from first word
      expect(generatePrefix("hello world")).toBe("HEL");
    });

    it("uppercases single words", () => {
      expect(generatePrefix("backlog")).toBe("BACK");
    });
  });

  describe("special characters", () => {
    it("strips accents", () => {
      expect(generatePrefix("Café")).toBe("CAFE");
    });

    it("removes non-alphanumeric characters", () => {
      expect(generatePrefix("My-Project!")).toBe("MYPR");
    });

    it("handles names with only special characters after cleaning", () => {
      expect(generatePrefix("!!!")).toBe("");
    });
  });

  describe("edge cases", () => {
    it("returns empty string for empty input", () => {
      expect(generatePrefix("")).toBe("");
    });

    it("returns empty string for whitespace-only input", () => {
      expect(generatePrefix("   ")).toBe("");
    });

    it("trims leading and trailing whitespace", () => {
      expect(generatePrefix("  Task  ")).toBe("TASK");
    });

    it("enforces max 10 character limit", () => {
      const longName = "A B C D E F G H I J K L";
      expect(generatePrefix(longName).length).toBeLessThanOrEqual(10);
    });
  });
});
