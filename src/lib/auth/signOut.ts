import authClient from "@/lib/auth/authClient";

/**
 * Sign out from the application.
 *
 * TODO: Implement federated logout to also sign out from the IDP session.
 * @see https://linear.app/omnidev/issue/OMNI-304/resolve-federated-logout
 */
const signOut = async () => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.href = "/";
      },
    },
  });
};

export default signOut;
