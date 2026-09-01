import { customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type auth from "@/lib/auth/auth";

/**
 * Auth browser client.
 *
 * better-auth 1.7 rebuilt generic OAuth on the social-provider path, so the
 * dedicated `genericOAuthClient` plugin is gone; generic providers are driven
 * through `signIn.social` on the base client with no extra client plugin
 */
const authClient = createAuthClient({
  plugins: [customSessionClient<typeof auth>()],
});

export default authClient;
