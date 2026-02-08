import { z } from "zod";

export const inviteSchema = z.object({
  inviterEmail: z.email(),
  inviterUsername: z.string(),
  recipientEmail: z.email(),
  workspaceName: z.string(),
});

interface SendInviteEmailParams {
  recipientEmail: string;
  inviterName: string;
  workspaceName: string;
  inviteLink: string;
}

/**
 * Send an invite email via Resend.
 * Silently skips when RESEND_API_KEY is not configured.
 * The invite link is the primary mechanism; email is optional.
 */
export async function sendInviteEmail({
  recipientEmail,
  inviterName,
  workspaceName,
  inviteLink,
}: SendInviteEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.VITE_FROM_EMAIL_ADDRESS || "noreply@omni.dev";

  if (!apiKey) return;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: recipientEmail,
        subject: `${inviterName} invited you to ${workspaceName}`,
        html: `
          <p>${inviterName} has invited you to join <strong>${workspaceName}</strong>.</p>
          <p><a href="${inviteLink}">Accept Invitation</a></p>
          <p>This link expires in 7 days.</p>
        `,
      }),
    });
  } catch {
    // Email is best-effort; don't fail the invite flow
  }
}
