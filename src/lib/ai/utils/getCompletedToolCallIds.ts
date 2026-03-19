/** Collect completed tool call IDs from messages. */

import { isToolOrDynamicToolUIPart } from "ai";

import type { UIMessage } from "ai";

/**
 * Get all completed tool call IDs across all messages.
 *
 * @param messages - Array of messages from the chat
 * @returns Set of tool call IDs that have been executed
 */
export function getCompletedToolCallIds(messages: UIMessage[]): Set<string> {
  const ids = new Set<string>();

  for (const message of messages) {
    if (message.role !== "assistant") continue;

    for (const part of message.parts) {
      if (
        isToolOrDynamicToolUIPart(part) &&
        part.state === "output-available"
      ) {
        ids.add(part.toolCallId);
      }
    }
  }

  return ids;
}
