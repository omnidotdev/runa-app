import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute({
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
