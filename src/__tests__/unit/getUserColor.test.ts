import { describe, expect, it } from "bun:test";

import getUserColor from "@/lib/util/getUserColor";

describe("getUserColor", () => {
  it("returns a hex color string", () => {
    const color = getUserColor("user-123");
    expect(color).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("is deterministic (same ID returns same color)", () => {
    const a = getUserColor("user-abc");
    const b = getUserColor("user-abc");
    expect(a).toBe(b);
  });

  it("returns different colors for different IDs", () => {
    const colors = new Set(
      ["alice", "bob", "charlie", "diana", "eve", "frank"].map(getUserColor),
    );
    // Should have more than 1 unique color
    expect(colors.size).toBeGreaterThan(1);
  });

  it("handles empty string", () => {
    const color = getUserColor("");
    expect(color).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("handles UUID-style IDs", () => {
    const color = getUserColor("550e8400-e29b-41d4-a716-446655440000");
    expect(color).toMatch(/^#[0-9a-f]{6}$/);
  });
});
