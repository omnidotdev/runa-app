import authClient from "@/lib/auth/authClient";

export const signIn = async ({ redirectUrl }: { redirectUrl: string }) => {
  await authClient.signIn.oauth2({
    providerId: "omni",
    callbackURL: redirectUrl,
  });
};
