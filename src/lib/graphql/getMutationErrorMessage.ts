import { ClientError } from "graphql-request";

/**
 * Message shown when a mutation is rejected by content moderation. Kept
 * client-side so the copy is consistent across every create/update surface; the
 * server only signals the reason via the `CONTENT_MODERATED` extension code.
 */
const CONTENT_MODERATED_MESSAGE =
  "Your text was flagged as inappropriate language. Please edit it and try again.";

/**
 * Resolve a user-facing message for a failed mutation, special-casing content
 * moderation rejections (which a generic "try again" would misdescribe, since
 * retrying the same text always fails). Any other error falls back to the
 * caller's generic message so we never leak server detail.
 */
export const getMutationErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (
    error instanceof ClientError &&
    error.response.errors?.some(
      (err) => err.extensions?.code === "CONTENT_MODERATED",
    )
  ) {
    return CONTENT_MODERATED_MESSAGE;
  }

  return fallback;
};
