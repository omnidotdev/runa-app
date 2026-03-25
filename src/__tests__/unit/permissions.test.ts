import { describe, expect, it } from "bun:test";

import { Role, isAdminOrOwner, isOwner } from "@/lib/permissions";

describe("isAdminOrOwner", () => {
  it("returns true for owner", () => {
    expect(isAdminOrOwner(Role.Owner)).toBe(true);
  });

  it("returns true for admin", () => {
    expect(isAdminOrOwner(Role.Admin)).toBe(true);
  });

  it("returns false for member", () => {
    expect(isAdminOrOwner(Role.Member)).toBe(false);
  });
});

describe("isOwner", () => {
  it("returns true for owner", () => {
    expect(isOwner(Role.Owner)).toBe(true);
  });

  it("returns false for admin", () => {
    expect(isOwner(Role.Admin)).toBe(false);
  });

  it("returns false for member", () => {
    expect(isOwner(Role.Member)).toBe(false);
  });
});
