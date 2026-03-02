import authClient from "@/lib/auth/authClient";

interface Params {
  /** Redirect URL */
  redirectUrl: string;
  /** OAuth provider ID */
  providerId: string;
}

/**
 * Sign in with OAuth2 provider.
 */
const signIn = async ({ redirectUrl, providerId }: Params) => {
  const res = await authClient.signIn.oauth2({
    providerId,
    callbackURL: redirectUrl,
  });

  if (res?.error) {
    throw new Error(res.error.message || "OAuth sign-in failed");
  }
};

export default signIn;
