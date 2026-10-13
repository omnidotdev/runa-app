/**
 * The wire protocol between the Runa host and a sandboxed plugin, plus the pure
 * request-handling logic. Kept framework-free and side-effect-free so it can be
 * unit-tested without a DOM: host.ts wires real MessagePorts to {@link handleRpc},
 * and sdk.ts (plugin side) speaks the same envelopes.
 */

import type { PluginScope } from "./types";

/** Handshake message the host posts to the plugin frame, transferring the RPC port. */
export const HANDSHAKE_TYPE = "runa-plugin:init";

/** RPC methods a plugin may call on the host. */
export type RpcMethod =
  | "getContext"
  | "storage.get"
  | "storage.set"
  | "query"
  | "mutate";

/** The scope each method requires. A method is callable only if its scope was granted. */
export const METHOD_SCOPE: Record<RpcMethod, PluginScope> = {
  getContext: "context:read",
  "storage.get": "storage",
  "storage.set": "storage",
  query: "task:read",
  mutate: "task:write",
};

export interface RpcRequest {
  kind: "rpc-request";
  id: string;
  method: RpcMethod;
  params?: unknown;
}

export type RpcResponse =
  | { kind: "rpc-response"; id: string; ok: true; result: unknown }
  | { kind: "rpc-response"; id: string; ok: false; error: string };

/** The host-side implementations the RPC router dispatches to. */
export interface PluginHostHandlers {
  getContext: () => unknown;
  storageGet: (key: string) => unknown;
  storageSet: (key: string, value: unknown) => void;
  query: (params: unknown) => unknown | Promise<unknown>;
  mutate: (params: unknown) => unknown | Promise<unknown>;
}

/** Narrow unknown postMessage data to a well-formed RPC request. */
export const isRpcRequest = (value: unknown): value is RpcRequest => {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    v.kind === "rpc-request" &&
    typeof v.id === "string" &&
    typeof v.method === "string" &&
    v.method in METHOD_SCOPE
  );
};

/** Whether a method may run given the scopes the workspace granted the plugin. */
export const isMethodAllowed = (
  method: RpcMethod,
  granted: readonly PluginScope[],
): boolean => granted.includes(METHOD_SCOPE[method]);

/**
 * Pure RPC router: given a request, the granted scopes, and the host handlers,
 * produce the response. Denies any method whose scope was not granted before the
 * handler runs, and turns a throwing/rejecting handler into an error response so
 * a plugin can never crash the host.
 */
export const handleRpc = async (
  request: RpcRequest,
  granted: readonly PluginScope[],
  handlers: PluginHostHandlers,
): Promise<RpcResponse> => {
  const { id, method, params } = request;
  if (!isMethodAllowed(method, granted)) {
    return {
      kind: "rpc-response",
      id,
      ok: false,
      error: `scope denied: ${method}`,
    };
  }
  try {
    const p = (params ?? {}) as { key?: string; value?: unknown };
    let result: unknown;
    switch (method) {
      case "getContext":
        result = handlers.getContext();
        break;
      case "storage.get":
        result = handlers.storageGet(String(p.key));
        break;
      case "storage.set":
        handlers.storageSet(String(p.key), p.value);
        result = true;
        break;
      case "query":
        result = await handlers.query(params);
        break;
      case "mutate":
        result = await handlers.mutate(params);
        break;
    }
    return { kind: "rpc-response", id, ok: true, result };
  } catch (error) {
    return {
      kind: "rpc-response",
      id,
      ok: false,
      error: error instanceof Error ? error.message : "plugin host error",
    };
  }
};
