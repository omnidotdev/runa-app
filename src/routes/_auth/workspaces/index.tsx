import workspacesOptions from "@/lib/options/workspaces.options";
import seo from "@/utils/seo";

export const Route = createFileRoute({
  head: () => ({
    meta: [...seo({ title: "Workspaces" })],
  }),
  component: Workspaces,
  loader: async ({ context }) =>
    await context.queryClient.ensureQueryData(workspacesOptions),
});

function Workspaces() {
  return (
    <div className="flex h-full items-center justify-center">
      TODO: Workspaces Overview
    </div>
  );
}
