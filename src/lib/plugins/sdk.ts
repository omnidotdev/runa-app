/**
 * Plugin-side SDK: what a plugin author imports. `connectToHost()` waits for the
 * host handshake, then returns a typed, promise-based client over the private
 * RPC port. Every call is still gated by the scopes the workspace granted; a
 * denied call rejects with the host's error.
 */

import { HANDSHAKE_TYPE } from "./protocol";

import type { RpcMethod, RpcResponse } from "./protocol";

export interface PluginHostApi {
  /** The current host context (e.g. the task the panel is rendered in). */
  getContext: () => Promise<unknown>;
  storage: {
    get: (key: string) => Promise<unknown>;
    set: (key: string, value: unknown) => Promise<void>;
  };
  /** Read via Runa's API under the plugin's granted read scope. */
  query: (params: unknown) => Promise<unknown>;
  /** Write via Runa's API under the plugin's granted write scope. */
  mutate: (params: unknown) => Promise<unknown>;
}

const isRpcResponse = (value: unknown): value is RpcResponse =>
  typeof value === "object" &&
  value !== null &&
  (value as { kind?: unknown }).kind === "rpc-response";

/**
 * Establish the bridge to the Runa host. Resolves once the host has transferred
 * the RPC port. Reject handling: any call whose scope was not granted (or whose
 * host handler threw) rejects with an Error carrying the host's message.
 */
export const connectToHost = (): Promise<PluginHostApi> =>
  new Promise((resolve) => {
    const onInit = (event: MessageEvent) => {
      if ((event.data as { type?: unknown })?.type !== HANDSHAKE_TYPE) return;
      const port = event.ports[0];
      if (!port) return;
      window.removeEventListener("message", onInit);

      const pending = new Map<string, (response: RpcResponse) => void>();
      port.onmessage = (e: MessageEvent) => {
        if (isRpcResponse(e.data)) pending.get(e.data.id)?.(e.data);
      };
      port.start();

      let counter = 0;
      const call = (method: RpcMethod, params?: unknown): Promise<unknown> =>
        new Promise((res, rej) => {
          const id = String(++counter);
          pending.set(id, (response) => {
            pending.delete(id);
            if (response.ok) res(response.result);
            else rej(new Error(response.error));
          });
          port.postMessage({ kind: "rpc-request", id, method, params });
        });

      resolve({
        getContext: () => call("getContext"),
        storage: {
          get: (key) => call("storage.get", { key }),
          set: (key, value) =>
            call("storage.set", { key, value }) as Promise<void>,
        },
        query: (params) => call("query", params),
        mutate: (params) => call("mutate", params),
      });
    };

    window.addEventListener("message", onInit);
  });
