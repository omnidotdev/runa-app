import { describe, expect, it } from "bun:test";

import getDomainLabel from "@/lib/util/getDomainLabel";

describe("getDomainLabel", () => {
  describe("known domains", () => {
    it("returns GitHub for github.com", () => {
      expect(getDomainLabel("https://github.com/omni")).toBe("GitHub");
    });

    it("returns Discord for discord.gg", () => {
      expect(getDomainLabel("https://discord.gg/invite")).toBe("Discord");
    });

    it("returns YouTube for youtu.be", () => {
      expect(getDomainLabel("https://youtu.be/abc")).toBe("YouTube");
    });

    it("returns X for x.com", () => {
      expect(getDomainLabel("https://x.com/omni")).toBe("X");
    });

    it("returns Product Hunt for producthunt.com", () => {
      expect(getDomainLabel("https://producthunt.com/posts/runa")).toBe(
        "Product Hunt",
      );
    });

    it("returns Figma for figma.com", () => {
      expect(getDomainLabel("https://figma.com/design/abc")).toBe("Figma");
    });
  });

  describe("www prefix", () => {
    it("strips www. before matching", () => {
      expect(getDomainLabel("https://www.github.com/omni")).toBe("GitHub");
    });
  });

  describe("unknown domains", () => {
    it("returns the hostname for unknown domains", () => {
      expect(getDomainLabel("https://example.com/page")).toBe("example.com");
    });

    it("strips www. from unknown domains", () => {
      expect(getDomainLabel("https://www.example.com")).toBe("example.com");
    });
  });

  describe("edge cases", () => {
    it("returns empty string for empty input", () => {
      expect(getDomainLabel("")).toBe("");
    });

    it("returns the raw string for invalid URLs", () => {
      expect(getDomainLabel("not-a-url")).toBe("not-a-url");
    });
  });
});
