import { Auth } from "@auth/core";

import authOptions from "@/lib/auth/auth.config";

export const ServerRoute = createServerFileRoute().methods({
  GET: async ({ request }) => {
    return Auth(request, authOptions);
  },
  POST: async ({ request }) => {
    return Auth(request, authOptions);
  },
});
