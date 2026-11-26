import { afterAll, beforeEach, describe, expect, mock, test } from "bun:test";

const calls: string[] = [];

const mockSignOutLocal = mock(async () => {
  calls.push("signOutLocal");
  return { idpLogoutUrl: "https://identity.example.com/oauth2/end-session" };
});
const mockSignIn = mock(async (_params: unknown) => {
  calls.push("signIn");
});

mock.module("@/server/functions/auth", () => ({
  signOutLocal: mockSignOutLocal,
}));

mock.module("@/lib/auth/signIn", () => ({ default: mockSignIn }));

const { followSignOut, followSwitch } = await import("./followIdentity");

const originalWindow = globalThis.window;

/** Minimal window stand-in exposing the location the helpers read and set */
const fakeWindow = {
  location: { pathname: "/workspaces/acme", search: "?tab=board", href: "" },
};

beforeEach(() => {
  calls.length = 0;
  mockSignOutLocal.mockClear();
  mockSignIn.mockClear();
  fakeWindow.location.href = "";
  globalThis.window = fakeWindow as unknown as typeof globalThis.window;
});

afterAll(() => {
  globalThis.window = originalWindow;
});

describe("followIdentity", () => {
  test("a switched account signs out locally, then signs in again back to the same page", async () => {
    await followSwitch();

    expect(calls).toEqual(["signOutLocal", "signIn"]);
    expect(mockSignIn).toHaveBeenCalledWith({
      redirectUrl: "/workspaces/acme?tab=board",
      providerId: "omni",
    });
  });

  test("a sign-out elsewhere signs out locally only and goes home", async () => {
    await followSignOut();

    expect(calls).toEqual(["signOutLocal"]);
    expect(mockSignIn).not.toHaveBeenCalled();
    // The federated end-session URL is ignored: the identity provider session is already gone
    expect(fakeWindow.location.href).toBe("/");
  });
});
