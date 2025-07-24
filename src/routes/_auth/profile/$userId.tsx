export const Route = createFileRoute({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/profile/$userId"!</div>;
}
