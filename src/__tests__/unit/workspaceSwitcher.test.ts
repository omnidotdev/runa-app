import { describe, expect, it } from "bun:test";

import {
  routeSlugForId,
  toWorkspaceOptions,
  workspaceIdForSlug,
} from "@/lib/util/workspaceSwitcher";

import type { WorkspaceClaim } from "@omnidotdev/providers/react";

const claim = (overrides: Partial<WorkspaceClaim>): WorkspaceClaim => ({
  id: "ws-1",
  name: "Acme",
  slug: "acme",
  logo: null,
  type: "team",
  roles: ["member"],
  teams: [],
  ...overrides,
});

const workspaces = [
  claim({ id: "ws-1", name: "Acme", slug: "acme", logo: "https://x/a.png" }),
  claim({ id: "ws-2", name: "Personal", slug: "ada", type: "personal" }),
  claim({ id: "ws-3", name: "Unslugged", slug: "" }),
];

describe("toWorkspaceOptions", () => {
  it("keys options by workspace id and carries name, slug, and logo", () => {
    expect(toWorkspaceOptions(workspaces)[0]).toEqual({
      id: "ws-1",
      name: "Acme",
      slug: "acme",
      logo: "https://x/a.png",
    });
  });
});

describe("workspaceIdForSlug", () => {
  it("resolves the active workspace from the route slug", () => {
    expect(workspaceIdForSlug(workspaces, "ada")).toBe("ws-2");
  });

  it("has no active workspace off a workspace route or for a foreign slug", () => {
    expect(workspaceIdForSlug(workspaces, undefined)).toBeUndefined();
    expect(workspaceIdForSlug(workspaces, "someone-else")).toBeUndefined();
  });
});

describe("routeSlugForId", () => {
  it("navigates to the selected workspace's slug", () => {
    expect(routeSlugForId(workspaces, "ws-1")).toBe("acme");
  });

  it("falls back to the id when the workspace has no slug", () => {
    expect(routeSlugForId(workspaces, "ws-3")).toBe("ws-3");
    expect(workspaceIdForSlug(workspaces, "ws-3")).toBe("ws-3");
  });

  it("ignores an unknown id", () => {
    expect(routeSlugForId(workspaces, "missing")).toBeUndefined();
  });
});
