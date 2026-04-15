import { describe, expect, it } from "bun:test";

import generatePrefix from "@/lib/util/generatePrefix";

describe("generatePrefix", () => {
  describe("multi-word names", () => {
    it("takes first letter of two words", () => {
      expect(generatePrefix("Project Management")).toBe("PM");
    });

    it("takes first letter of three words", () => {
      expect(generatePrefix("My Cool Project")).toBe("MCP");
    });

    it("takes first letter of each word for short acronyms", () => {
      expect(generatePrefix("Alpha Beta")).toBe("AB");
    });

    it("handles two-letter acronyms from short words", () => {
      expect(generatePrefix("Go Do")).toBe("GD");
    });
  });

  describe("short prefixes", () => {
    it("allows single-character prefix from single-char word", () => {
      expect(generatePrefix("X")).toBe("X");
    });

    it("allows two-character prefix from two-char word", () => {
      expect(generatePrefix("S1")).toBe("S1");
    });

    it("allows two-character prefix from two-word name", () => {
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
      expect(generatePrefix("hello world")).toBe("HW");
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
