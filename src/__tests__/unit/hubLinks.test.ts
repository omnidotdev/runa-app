import { afterEach, describe, expect, it } from "bun:test";

import {
  manageSubscriptionUrl,
  upgradePlanUrl,
  workspaceSettingsUrl,
} from "@/lib/billing/hubLinks";

const HUB = "https://account.omni.dev";
const RUNA = "https://runa.omni.dev";

const params = (url: string) => Object.fromEntries(new URL(url).searchParams);

describe("workspaceSettingsUrl", () => {
  afterEach(() => {
    // biome-ignore lint/suspicious/noExplicitAny: stub the browser global for the fallback
    delete (globalThis as any).window;
  });

  it("points at the workspace's settings page", () => {
    expect(workspaceSettingsUrl(`${RUNA}/`, "acme")).toBe(
      `${RUNA}/@acme/~/settings`,
    );
  });

  it("falls back to the browser origin when the base URL is empty", () => {
    // biome-ignore lint/suspicious/noExplicitAny: stub the browser global for the fallback
    (globalThis as any).window = { location: { origin: RUNA } };

    expect(workspaceSettingsUrl("", "acme")).toBe(`${RUNA}/@acme/~/settings`);
  });

  it("is undefined without a base URL outside the browser", () => {
    expect(workspaceSettingsUrl("", "acme")).toBeUndefined();
  });
});

describe("upgradePlanUrl", () => {
  it("buys the plan on the account hub and returns to the workspace's settings", () => {
    const url = upgradePlanUrl(HUB, RUNA, {
      plan: "pro",
      interval: "month",
      workspaceSlug: "acme",
    });

    expect(url.startsWith(`${HUB}/billing?`)).toBe(true);
    expect(params(url)).toEqual({
      product: "runa",
      plan: "pro",
      interval: "month",
      workspace: "acme",
      return: `${RUNA}/@acme/~/settings`,
    });
  });

  it("lets the hub ask for the workspace and returns to pricing", () => {
    expect(
      params(upgradePlanUrl(HUB, RUNA, { plan: "team", interval: "year" })),
    ).toEqual({
      product: "runa",
      plan: "team",
      interval: "year",
      return: `${RUNA}/pricing`,
    });
  });

  it("is empty when no account hub is configured", () => {
    expect(
      upgradePlanUrl(undefined, RUNA, { plan: "pro", interval: "month" }),
    ).toBe("");
  });
});

describe("manageSubscriptionUrl", () => {
  it("manages the workspace's plan on the account hub", () => {
    const url = manageSubscriptionUrl(HUB, RUNA, "acme");

    expect(url.startsWith(`${HUB}/billing?`)).toBe(true);
    expect(params(url)).toEqual({
      product: "runa",
      workspace: "acme",
      manage: "1",
      return: `${RUNA}/@acme/~/settings`,
    });
  });

  it("is empty when no account hub is configured", () => {
    expect(manageSubscriptionUrl("", RUNA, "acme")).toBe("");
  });
});
