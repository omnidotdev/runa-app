import { describe, expect, it } from "bun:test";

import memberListState from "@/lib/util/memberListState";

describe("memberListState", () => {
  it("shows the list whenever members loaded, even if a refetch errored", () => {
    expect(
      memberListState({ degraded: false, isError: false, memberCount: 3 }),
    ).toBe("list");
    expect(
      memberListState({ degraded: true, isError: true, memberCount: 3 }),
    ).toBe("list");
  });

  it("prompts re-auth on a degraded session with no members loaded", () => {
    expect(
      memberListState({ degraded: true, isError: false, memberCount: 0 }),
    ).toBe("degraded");
  });

  it("prefers the degraded prompt over a generic error", () => {
    expect(
      memberListState({ degraded: true, isError: true, memberCount: 0 }),
    ).toBe("degraded");
  });

  it("reports an error when the list failed to load and the session is intact", () => {
    expect(
      memberListState({ degraded: false, isError: true, memberCount: 0 }),
    ).toBe("error");
  });

  it("reports empty only when the workspace genuinely has no members", () => {
    expect(
      memberListState({ degraded: false, isError: false, memberCount: 0 }),
    ).toBe("empty");
  });
});
