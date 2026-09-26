import { describe, expect, it } from "bun:test";

import extractUrls from "@/lib/util/extractUrls";

describe("extractUrls", () => {
  it("pulls URLs from anchor hrefs", () => {
    expect(
      extractUrls('<p>see <a href="https://example.com/docs">docs</a></p>'),
    ).toEqual(["https://example.com/docs"]);
  });

  it("pulls bare URLs from text and strips trailing punctuation", () => {
    expect(extractUrls("read https://example.com/page.")).toEqual([
      "https://example.com/page",
    ]);
    expect(extractUrls("(https://example.com/a)")).toEqual([
      "https://example.com/a",
    ]);
  });

  it("dedupes and ignores non-http links", () => {
    const html =
      '<a href="https://a.com">a</a> https://a.com <a href="mailto:x@y.com">m</a> <a href="/rel">r</a>';
    expect(extractUrls(html)).toEqual(["https://a.com"]);
  });

  it("caps the number of URLs returned", () => {
    const html = Array.from(
      { length: 10 },
      (_, i) => `https://example.com/${i}`,
    ).join(" ");
    expect(extractUrls(html, 3)).toHaveLength(3);
  });

  it("returns an empty array for content with no URLs", () => {
    expect(extractUrls("<p>just text</p>")).toEqual([]);
    expect(extractUrls("")).toEqual([]);
  });
});
