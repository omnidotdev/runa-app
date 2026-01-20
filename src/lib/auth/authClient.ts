import {
  customSessionClient,
  genericOAuthClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type auth from "@/lib/auth/auth";

/**
 * Auth browser client.
 */
const authClient = createAuthClient({
  plugins: [genericOAuthClient(), customSessionClient<typeof auth>()],
});

export default authClient;
