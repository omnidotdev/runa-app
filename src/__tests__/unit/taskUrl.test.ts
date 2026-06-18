import { describe, expect, it } from "bun:test";

import {
  buildTaskDisplayKey,
  buildTaskKey,
  isTaskRowId,
  parseTaskParam,
} from "@/lib/util/taskUrl";

describe("parseTaskParam", () => {
  it("parses a legacy UUID into a rowId lookup", () => {
    const result = parseTaskParam("3f9a1b2c-4d5e-6f7a-8b9c-0d1e2f3a4b5c");

    expect(result).toEqual({
      type: "uuid",
      rowId: "3f9a1b2c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
    });
  });

  it("parses a number with a trailing slug", () => {
    expect(parseTaskParam("42-fix-the-login-bug")).toEqual({
      type: "number",
      number: 42,
      slug: "fix-the-login-bug",
    });
  });

  it("parses a bare number without a slug", () => {
    expect(parseTaskParam("42")).toEqual({
      type: "number",
      number: 42,
      slug: undefined,
    });
  });

  it("returns invalid for a non-numeric, non-uuid param", () => {
    expect(parseTaskParam("fix-the-login-bug")).toEqual({ type: "invalid" });
  });

  it("returns invalid for an empty param", () => {
    expect(parseTaskParam("")).toEqual({ type: "invalid" });
  });
});

describe("isTaskRowId", () => {
  it("accepts a UUID rowId", () => {
    expect(isTaskRowId("3f9a1b2c-4d5e-6f7a-8b9c-0d1e2f3a4b5c")).toBe(true);
  });

  it("rejects a vanity {number}-{slug} key", () => {
    expect(
      isTaskRowId("4-client-follow-ups-for-faq-handouts-blocked-on-alisha"),
    ).toBe(false);
  });

  it("rejects a bare number key", () => {
    expect(isTaskRowId("42")).toBe(false);
  });

  it("rejects null, undefined, and empty values", () => {
    expect(isTaskRowId(null)).toBe(false);
    expect(isTaskRowId(undefined)).toBe(false);
    expect(isTaskRowId("")).toBe(false);
  });
});

describe("buildTaskKey", () => {
  it("joins number and a slug derived from rich-text content", () => {
    expect(
      buildTaskKey({ number: 42, content: "<p>Fix the login bug</p>" }),
    ).toBe("42-fix-the-login-bug");
  });

  it("returns the bare number when content is empty or markup-only", () => {
    expect(buildTaskKey({ number: 42, content: "<p></p>" })).toBe("42");
    expect(buildTaskKey({ number: 42, content: undefined })).toBe("42");
  });
});

describe("buildTaskDisplayKey", () => {
  it("joins the project prefix and number", () => {
    expect(buildTaskDisplayKey({ prefix: "API", number: 42 })).toBe("API-42");
  });

  it("falls back to PROJ when there is no prefix", () => {
    expect(buildTaskDisplayKey({ prefix: null, number: 42 })).toBe("PROJ-42");
  });
});
