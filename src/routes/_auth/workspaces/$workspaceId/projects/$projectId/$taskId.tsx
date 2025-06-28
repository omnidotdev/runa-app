export const Route = createFileRoute({
  ssr: false,
  component: TaskPage,
});

function TaskPage() {
  return (
    <div className="flex h-full items-center justify-center">
      TODO: Task Page
    </div>
  );
}
