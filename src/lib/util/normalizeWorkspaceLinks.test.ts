import { describe, expect, it } from "bun:test";

import normalizeWorkspaceLinks from "./normalizeWorkspaceLinks";

describe("normalizeWorkspaceLinks", () => {
  it("parses a JSON string (the shape Gatekeeper actually returns)", () => {
    const raw =
      '[{"url":"https://topcrush.app","title":"Website","visibility":"public"}]';
    expect(normalizeWorkspaceLinks(raw)).toEqual([
      { url: "https://topcrush.app", title: "Website", visibility: "public" },
    ]);
  });

  it("passes a real array through", () => {
    const links = [{ url: "https://a.com", title: "A" }];
    expect(normalizeWorkspaceLinks(links)).toEqual(links);
  });

  it("returns [] for null or undefined", () => {
    expect(normalizeWorkspaceLinks(null)).toEqual([]);
    expect(normalizeWorkspaceLinks(undefined)).toEqual([]);
  });

  it("returns [] for an unparseable string instead of throwing", () => {
    expect(normalizeWorkspaceLinks("not json")).toEqual([]);
  });

  it("returns [] for a non-array, non-string value", () => {
    expect(normalizeWorkspaceLinks({ url: "https://a.com" })).toEqual([]);
    expect(normalizeWorkspaceLinks(42)).toEqual([]);
  });

  it("drops entries without a string url", () => {
    const raw = '[{"url":"https://ok.com"},{"title":"no url"},null,"x"]';
    expect(normalizeWorkspaceLinks(raw)).toEqual([{ url: "https://ok.com" }]);
  });
});
