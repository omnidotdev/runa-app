export const Route = createFileRoute({
  component: TaskPage,
});

function TaskPage() {
  return (
    <div>
      Hello "/_auth/workspaces/$workspaceId/projects/$projectId/$taskId"!
    </div>
  );
}
