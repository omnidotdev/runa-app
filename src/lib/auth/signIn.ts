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
  await authClient.signIn.oauth2({
    providerId,
    callbackURL: redirectUrl,
  });
};

export default signIn;
