import { describe, expect, test } from "bun:test";

import { toClientSession } from "./clientSession";

import type { GetAuthSession } from "@omnidotdev/providers/auth";

const authSession: GetAuthSession = {
  session: {
    id: "sess_1",
    token: "secret-session-token",
    expiresAt: "2030-01-01T00:00:00.000Z",
    ipAddress: "203.0.113.7",
    userAgent: "test-agent",
  },
  user: {
    id: "user_1",
    name: "Ada",
    email: "ada@example.com",
    emailVerified: true,
    image: null,
    identityProviderId: "idp_1",
    rowId: "row_1",
  },
  accessToken: "at_live",
  organizations: [],
};

describe("toClientSession", () => {
  test("returns null when unauthenticated", () => {
    expect(toClientSession(null)).toBeNull();
  });

  test("keeps the session token, IP, and user agent out of the browser", () => {
    const client = toClientSession(authSession);
    const serialized = JSON.stringify(client);

    expect(client).not.toHaveProperty("session");
    expect(serialized).not.toContain("secret-session-token");
    expect(serialized).not.toContain("203.0.113.7");
    expect(serialized).not.toContain("test-agent");
  });

  test("keeps the fields the client reads", () => {
    expect(toClientSession(authSession)).toEqual({
      user: {
        id: "user_1",
        name: "Ada",
        email: "ada@example.com",
        image: null,
        identityProviderId: "idp_1",
        rowId: "row_1",
      },
      accessToken: "at_live",
      organizations: [],
    });
  });
});
