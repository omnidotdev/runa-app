import type { GatekeeperInvitation } from "@omnidotdev/providers/auth";

type ValidationResult = { valid: true } | { valid: false; reason: string };

interface ValidateInvitationParams {
  email: string;
  pendingInvitations: GatekeeperInvitation[];
  memberEmails: string[];
}

/**
 * Validate that an invitation email doesn't conflict with existing
 * pending invitations or current org members.
 */
const validateInvitation = ({
  email,
  pendingInvitations,
  memberEmails,
}: ValidateInvitationParams): ValidationResult => {
  const normalizedEmail = email.toLowerCase();

  const hasPendingInvite = pendingInvitations.some(
    (inv) =>
      inv.status === "pending" && inv.email.toLowerCase() === normalizedEmail,
  );

  if (hasPendingInvite) {
    return {
      valid: false,
      reason: "An invitation is already pending for this email",
    };
  }

  const isExistingMember = memberEmails.some(
    (memberEmail) => memberEmail.toLowerCase() === normalizedEmail,
  );

  if (isExistingMember) {
    return {
      valid: false,
      reason: "This email is already a member of the organization",
    };
  }

  return { valid: true };
};

export { validateInvitation };

export type { ValidateInvitationParams, ValidationResult };
