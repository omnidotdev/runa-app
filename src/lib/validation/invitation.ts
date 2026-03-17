import type { GatekeeperInvitation } from "@omnidotdev/providers/auth";

type ValidationResult = { valid: true } | { valid: false; reason: string };

interface ValidateInvitationParams {
  email: string;
  pendingInvitations: GatekeeperInvitation[];
  memberEmails: string[];
}

/**
 * Check whether an invitation has expired based on its `expiresAt` timestamp.
 */
const isInvitationExpired = (invitation: GatekeeperInvitation): boolean =>
  new Date(invitation.expiresAt) < new Date();

/**
 * Validate that an invitation email doesn't conflict with existing
 * active (non-expired) pending invitations or current org members.
 */
const validateInvitation = ({
  email,
  pendingInvitations,
  memberEmails,
}: ValidateInvitationParams): ValidationResult => {
  const normalizedEmail = email.toLowerCase();

  const hasActivePendingInvite = pendingInvitations.some(
    (inv) =>
      inv.status === "pending" &&
      !isInvitationExpired(inv) &&
      inv.email.toLowerCase() === normalizedEmail,
  );

  if (hasActivePendingInvite) {
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

export { isInvitationExpired, validateInvitation };

export type { ValidateInvitationParams, ValidationResult };
