import { describe, expect, test } from "bun:test";

import { handleRpc, isMethodAllowed, isRpcRequest } from "../protocol";

import type { PluginHostHandlers, RpcRequest } from "../protocol";

const handlers: PluginHostHandlers = {
  getContext: () => ({ taskId: "t1" }),
  storageGet: (key) => `value-of-${key}`,
  storageSet: () => undefined,
  query: () => ({ rows: [1, 2] }),
  mutate: () => ({ updated: true }),
};

describe("isRpcRequest", () => {
  test("accepts a well-formed request", () => {
    expect(
      isRpcRequest({ kind: "rpc-request", id: "1", method: "getContext" }),
    ).toBe(true);
  });

  test("rejects unknown methods and malformed envelopes", () => {
    expect(isRpcRequest({ kind: "rpc-request", id: "1", method: "nope" })).toBe(
      false,
    );
    expect(isRpcRequest({ kind: "other", id: "1", method: "query" })).toBe(
      false,
    );
    expect(isRpcRequest(null)).toBe(false);
    expect(isRpcRequest({ id: 1, method: "query" })).toBe(false);
  });
});

describe("isMethodAllowed", () => {
  test("gates each method on its required scope", () => {
    expect(isMethodAllowed("query", ["task:read"])).toBe(true);
    expect(isMethodAllowed("mutate", ["task:read"])).toBe(false);
    expect(isMethodAllowed("mutate", ["task:read", "task:write"])).toBe(true);
    expect(isMethodAllowed("getContext", ["storage"])).toBe(false);
  });
});

describe("handleRpc", () => {
  const req = (method: RpcRequest["method"], params?: unknown): RpcRequest => ({
    kind: "rpc-request",
    id: "1",
    method,
    params,
  });

  test("runs an allowed method and returns its result", async () => {
    const res = await handleRpc(req("getContext"), ["context:read"], handlers);
    expect(res).toEqual({
      kind: "rpc-response",
      id: "1",
      ok: true,
      result: { taskId: "t1" },
    });
  });

  test("denies a method whose scope was not granted, without calling the handler", async () => {
    let called = false;
    const res = await handleRpc(req("mutate", { x: 1 }), ["task:read"], {
      ...handlers,
      mutate: () => {
        called = true;
        return {};
      },
    });
    expect(res.ok).toBe(false);
    expect(called).toBe(false);
    if (!res.ok) expect(res.error).toContain("scope denied");
  });

  test("awaits async handlers", async () => {
    const res = await handleRpc(req("query", { q: 1 }), ["task:read"], {
      ...handlers,
      query: async () => ({ rows: [9] }),
    });
    expect(res).toMatchObject({ ok: true, result: { rows: [9] } });
  });

  test("turns a throwing handler into an error response instead of crashing", async () => {
    const res = await handleRpc(req("query"), ["task:read"], {
      ...handlers,
      query: () => {
        throw new Error("boom");
      },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toBe("boom");
  });

  test("storage.set reports success and forwards key/value", async () => {
    const calls: Array<[string, unknown]> = [];
    const res = await handleRpc(
      req("storage.set", { key: "k", value: 42 }),
      ["storage"],
      {
        ...handlers,
        storageSet: (k, v) => {
          calls.push([k, v]);
        },
      },
    );
    expect(res).toMatchObject({ ok: true, result: true });
    expect(calls).toEqual([["k", 42]]);
  });
});
