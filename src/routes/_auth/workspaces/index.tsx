import workspacesOptions from "@/lib/options/workspaces.options";
import seo from "@/lib/util/seo";

export const Route = createFileRoute({
  ssr: false,
  head: () => ({
    meta: [...seo({ title: "Workspaces" })],
  }),
  component: WorkspacesOverviewPage,
  loader: async ({ context }) =>
    await context.queryClient.ensureQueryData(workspacesOptions),
});

function WorkspacesOverviewPage() {
  return (
    <div className="flex h-full items-center justify-center">
      TODO: Workspaces Overview
    </div>
  );
}
