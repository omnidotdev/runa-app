export const Route = createFileRoute({
  component: ProjectPage,
});

function ProjectPage() {
  return (
    <div>Hello "/_auth/workspaces/$workspaceId/projects/$projectId/"!</div>
  );
}
