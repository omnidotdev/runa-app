import { describe, expect, it } from "bun:test";

import { faviconUrl, isHttpUrl, shortenUrl } from "@/lib/util/linkChip";

describe("isHttpUrl", () => {
  it("accepts http and https URLs", () => {
    expect(isHttpUrl("https://docs.google.com/document/d/abc/edit")).toBe(true);
    expect(isHttpUrl("http://example.com")).toBe(true);
  });

  it("rejects non-URLs and non-http schemes (incl. dangerous ones)", () => {
    expect(isHttpUrl("just some text")).toBe(false);
    expect(isHttpUrl("ftp://example.com")).toBe(false);
    // biome-ignore lint/suspicious/noExplicitAny: intentional dangerous input
    expect(isHttpUrl("javascript:alert(1)" as any)).toBe(false);
    expect(isHttpUrl("")).toBe(false);
    expect(isHttpUrl("   ")).toBe(false);
  });

  it("accepts a URL with surrounding whitespace", () => {
    expect(isHttpUrl("  https://example.com  ")).toBe(true);
  });
});

describe("shortenUrl", () => {
  it("drops the scheme and www and an empty path", () => {
    expect(shortenUrl("https://www.example.com/")).toBe("example.com");
  });

  it("keeps a short host + path intact", () => {
    expect(shortenUrl("https://example.com/pricing")).toBe(
      "example.com/pricing",
    );
  });

  it("collapses a long path to host + last segment", () => {
    expect(
      shortenUrl("https://docs.google.com/document/d/1AbCdEfGhIjKlMnOp/edit"),
    ).toBe("docs.google.com/…/edit");
  });

  it("returns the raw string when it is not a URL", () => {
    expect(shortenUrl("not a url")).toBe("not a url");
  });
});

describe("faviconUrl", () => {
  it("builds an icon URL from the host", () => {
    expect(faviconUrl("https://docs.google.com/x")).toBe(
      "https://icons.duckduckgo.com/ip3/docs.google.com.ico",
    );
  });

  it("returns null for a non-URL", () => {
    expect(faviconUrl("nope")).toBeNull();
  });
});
