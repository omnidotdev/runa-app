import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import { z } from "zod";

import { WorkspaceInvitation } from "@/components/emails";
import app from "@/lib/config/app.config";
import {
  BASE_URL,
  FROM_EMAIL_ADDRESS,
  TO_EMAIL_ADDRESS,
} from "@/lib/config/env.config";

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
      from: `${app.name} Support <${FROM_EMAIL_ADDRESS}>`,
      to: TO_EMAIL_ADDRESS || recipientEmail,
      subject: `You have been invited to join the ${workspaceName} workspace on ${app.name}`,
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
