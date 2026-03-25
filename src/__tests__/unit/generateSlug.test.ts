import { describe, expect, it } from "bun:test";

import generateSlug from "@/lib/util/generateSlug";

describe("generateSlug", () => {
  it("converts spaces to dashes", () => {
    expect(generateSlug("hello world")).toBe("hello-world");
  });

  it("lowercases the result", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("removes accents", () => {
    expect(generateSlug("Café Résumé")).toBe("cafe-resume");
  });

  it("removes special characters", () => {
    expect(generateSlug("Hello! @World#")).toBe("hello-world");
  });

  it("collapses multiple dashes", () => {
    expect(generateSlug("hello---world")).toBe("hello-world");
  });

  it("removes leading dashes", () => {
    expect(generateSlug("--hello")).toBe("hello");
  });

  it("removes trailing dashes", () => {
    expect(generateSlug("hello--")).toBe("hello");
  });

  it("handles multiple spaces", () => {
    expect(generateSlug("hello   world")).toBe("hello-world");
  });

  it("preserves numbers", () => {
    expect(generateSlug("Project 123")).toBe("project-123");
  });

  it("handles empty string", () => {
    expect(generateSlug("")).toBe("");
  });
});
