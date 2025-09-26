import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/workspaces/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/workspaces/create"!</div>;
}
