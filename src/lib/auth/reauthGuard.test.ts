import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import {
  clearReauthAttempt,
  markReauthAttempt,
  reauthRecentlyAttempted,
} from "./reauthGuard";

/** Minimal in-memory sessionStorage stand-in for the guard under test. */
const makeStorage = () => {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
    removeItem: (k: string) => {
      map.delete(k);
    },
  } as Storage;
};

describe("reauthGuard", () => {
  beforeEach(() => {
    globalThis.sessionStorage = makeStorage();
  });

  afterEach(() => {
    // biome-ignore lint/suspicious/noExplicitAny: test teardown of the stub
    (globalThis as any).sessionStorage = undefined;
  });

  it("reports no attempt before one is marked", () => {
    expect(reauthRecentlyAttempted()).toBe(false);
  });

  it("reports a recent attempt after marking", () => {
    expect(markReauthAttempt()).toBe(true);
    expect(reauthRecentlyAttempted()).toBe(true);
  });

  it("stops reporting recent once the window elapses", () => {
    const realNow = Date.now;
    try {
      const base = 1_000_000;
      Date.now = () => base;
      markReauthAttempt();
      // 91s later, past the 90s suppression window
      Date.now = () => base + 91_000;
      expect(reauthRecentlyAttempted()).toBe(false);
    } finally {
      Date.now = realNow;
    }
  });

  it("clears the attempt so recovery can re-arm", () => {
    markReauthAttempt();
    clearReauthAttempt();
    expect(reauthRecentlyAttempted()).toBe(false);
  });

  it("returns false from markReauthAttempt when storage is unavailable", () => {
    // biome-ignore lint/suspicious/noExplicitAny: simulate a blocked storage
    (globalThis as any).sessionStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error("blocked");
      },
      removeItem: () => {},
    };
    expect(markReauthAttempt()).toBe(false);
    expect(reauthRecentlyAttempted()).toBe(false);
  });
});
