/**
 * Extract pending approval responses from UIMessages.
 *
 * TanStack AI's ModelMessage format doesn't include approval state,
 * so we extract approvals and send them separately in the request body.
 *
 * Only extracts approvals for tool-calls that haven't been executed yet
 * (no corresponding tool-result). This prevents re-sending old approvals
 * when making subsequent requests in the same session.
 */

import type { UIMessage } from "@tanstack/ai-client";

/** Prefix used by TanStack AI for approval IDs. */
const APPROVAL_PREFIX = "approval_";

/** Approval response structure. */
export interface ApprovalResponse {
  id: string;
  approved: boolean;
}

/**
 * Extract pending approval responses from UIMessages.
 *
 * @param messages - Array of UI messages from the chat
 * @returns Array of approval responses that haven't been executed yet
 */
export function extractApprovals(messages: UIMessage[]): ApprovalResponse[] {
  // First, collect all tool-call IDs that have been executed (have tool-results)
  const executedToolCallIds = new Set<string>();
  for (const message of messages) {
    if (message.role !== "assistant") continue;
    for (const part of message.parts) {
      if (part.type === "tool-result") {
        executedToolCallIds.add(part.toolCallId);
      }
    }
  }

  const approvalsMap = new Map<string, ApprovalResponse>();

  for (const message of messages) {
    if (message.role !== "assistant") continue;

    for (const part of message.parts) {
      if (
        part.type === "tool-call" &&
        part.state === "approval-responded" &&
        typeof part.approval?.id === "string" &&
        part.approval.id.length > 0 &&
        typeof part.approval?.approved === "boolean"
      ) {
        // Extract tool call ID from approval ID
        const toolCallId = part.approval.id.startsWith(APPROVAL_PREFIX)
          ? part.approval.id.slice(APPROVAL_PREFIX.length)
          : part.id;

        // Skip approvals for tools that have already been executed
        if (executedToolCallIds.has(toolCallId)) {
          continue;
        }

        approvalsMap.set(part.approval.id, {
          id: part.approval.id,
          approved: part.approval.approved,
        });
      }
    }
  }

  return Array.from(approvalsMap.values());
}
