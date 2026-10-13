/**
 * Host side of the plugin bridge. Mounts a plugin in a sandboxed iframe and
 * services its RPC over a private MessageChannel, enforcing the manifest's
 * granted scopes via the pure {@link handleRpc} router. Untrusted plugin code
 * runs in the opaque-origin sandbox and can reach the host ONLY through these
 * scoped methods, never the real DOM, cookies, or tokens.
 */

import { HANDSHAKE_TYPE, handleRpc, isRpcRequest } from "./protocol";

import type { PluginHostHandlers } from "./protocol";
import type { PluginManifest } from "./types";

export interface CreatePluginHostOptions {
  /** The sandboxed iframe the plugin runs in (sandbox="allow-scripts", no allow-same-origin). */
  iframe: HTMLIFrameElement;
  /** The installed manifest; its `scopes` are the granted scopes (post-consent). */
  manifest: PluginManifest;
  /** Host implementations for the scoped methods the plugin may call. */
  handlers: PluginHostHandlers;
  /**
   * Target origin for the handshake post. Defaults to "*" because a sandboxed
   * frame has an opaque ("null") origin; the init message carries no secret (only
   * a transferable port), and all RPC then flows over that private port.
   */
  handshakeTargetOrigin?: string;
}

export interface PluginHostController {
  /** Tear down listeners and close the port. */
  dispose: () => void;
}

/**
 * Wire a sandboxed plugin iframe to the scoped host API. Call after the iframe
 * element exists; the handshake fires on its `load` (and immediately if already
 * loaded) so the plugin receives its RPC port.
 */
export const createPluginHost = ({
  iframe,
  manifest,
  handlers,
  handshakeTargetOrigin = "*",
}: CreatePluginHostOptions): PluginHostController => {
  const channel = new MessageChannel();
  const port = channel.port1;
  const granted = manifest.scopes;

  port.onmessage = async (event: MessageEvent) => {
    if (!isRpcRequest(event.data)) return;
    const response = await handleRpc(event.data, granted, handlers);
    port.postMessage(response);
  };
  port.start();

  const sendHandshake = () => {
    iframe.contentWindow?.postMessage(
      { type: HANDSHAKE_TYPE, manifestId: manifest.id },
      handshakeTargetOrigin,
      [channel.port2],
    );
  };

  iframe.addEventListener("load", sendHandshake);
  // The frame may already be loaded when we attach (e.g. src set before mount).
  if (
    iframe.contentWindow &&
    iframe.contentDocument?.readyState === "complete"
  ) {
    sendHandshake();
  }

  return {
    dispose: () => {
      iframe.removeEventListener("load", sendHandshake);
      port.onmessage = null;
      port.close();
    },
  };
};
