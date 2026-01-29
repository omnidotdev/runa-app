/**
 * Collect completed tool call IDs from messages.
 *
 * Server-side tools have tool-results in different messages than tool-calls,
 * so we need to track completion globally across all messages.
 */

import type { UIMessage } from "@tanstack/ai-client";

/**
 * Get all completed tool call IDs across all messages.
 *
 * @param messages - Array of UI messages from the chat
 * @returns Set of tool call IDs that have been executed
 */
export function getCompletedToolCallIds(messages: UIMessage[]): Set<string> {
  const ids = new Set<string>();

  for (const message of messages) {
    if (message.role !== "assistant") continue;

    for (const part of message.parts) {
      if (part.type === "tool-result") {
        ids.add(part.toolCallId);
      }
    }
  }

  return ids;
}
