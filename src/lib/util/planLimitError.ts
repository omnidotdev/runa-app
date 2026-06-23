import { toast } from "sonner";

/**
 * Server-thrown limit messages (runa-api authorization plugins). graphql-request
 * flattens GraphQL errors into `Error.message`, so a substring match is reliable.
 */
const PLAN_LIMIT_MARKER = "Maximum number of";

/** Whether an error is a runa-api plan-limit rejection. */
export const isPlanLimitError = (error: unknown): boolean =>
  error instanceof Error && error.message.includes(PLAN_LIMIT_MARKER);

/**
 * Surface a plan-limit mutation failure as a toast with an upgrade affordance,
 * mirroring the in-context upsell used for assignees. Returns `true` when the
 * error was a plan-limit rejection (and a toast was shown), so callers can fall
 * back to generic handling otherwise.
 */
export const handlePlanLimitError = (
  error: unknown,
  { message, onUpgrade }: { message: string; onUpgrade: () => void },
): boolean => {
  if (!isPlanLimitError(error)) return false;

  toast.error(message, {
    action: {
      label: "Upgrade",
      onClick: onUpgrade,
    },
  });

  return true;
};
