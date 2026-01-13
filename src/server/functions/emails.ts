import { z } from "zod";

export const inviteSchema = z.object({
  inviterEmail: z.email(),
  inviterUsername: z.string(),
  recipientEmail: z.email(),
  workspaceName: z.string(),
});
