import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import { z } from "zod";

import WorkspaceInvitation from "@/components/emails/WorkspaceInvitation";
import { BASE_URL, isDevEnv } from "@/lib/config/env.config";

export const inviteSchema = z.object({
  inviterEmail: z.email(),
  inviterUsername: z.string(),
  recipientEmail: z.email(),
  workspaceName: z.string(),
});

export const sendInviteEmail = createServerFn({ method: "POST" })
  .inputValidator((data) => inviteSchema.parse(data))
  .handler(async ({ data }) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { inviterEmail, inviterUsername, recipientEmail, workspaceName } =
      data;

    const { data: email, error } = await resend.emails.send({
      from: `Runa Support <${isDevEnv ? "onboarding@resend.dev" : inviterEmail}>`,
      to: isDevEnv ? "delivered@resend.dev" : recipientEmail,
      subject: `You have been invited to join the ${workspaceName} workspace on Runa`,
      react: WorkspaceInvitation({
        inviterUsername,
        inviterEmail,
        workspaceName,
        recipientEmail,
        inviteUrl: BASE_URL,
      }),
    });

    if (error) throw new Error(error.message);

    return { email };
  });
