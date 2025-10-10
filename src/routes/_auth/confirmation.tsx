import { createFileRoute, redirect } from "@tanstack/react-router";

import { BASE_URL } from "@/lib/config/env.config";
import seo from "@/lib/util/seo";

export const Route = createFileRoute("/_auth/confirmation")({
  head: () => ({
    meta: [
      ...seo({
        title: "Confirmation",
        description: "Confirm your subscription.",
        url: `${BASE_URL}/confirmation`,
      }),
    ],
  }),
  beforeLoad: async ({ context: { session } }) => {
    throw redirect({
      to: "/profile/$userId",
      params: { userId: session?.user.hidraId! },
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return null;
}
