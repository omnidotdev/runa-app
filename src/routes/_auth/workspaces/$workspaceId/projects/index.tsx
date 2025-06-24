export const Route = createFileRoute({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/workspaces/$workspaceId/projects/"!</div>;
}
