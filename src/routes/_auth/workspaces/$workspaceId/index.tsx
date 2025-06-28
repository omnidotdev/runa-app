import { notFound } from "@tanstack/react-router";

import NotFound from "@/components/layout/NotFound";
import workspaceOptions from "@/lib/options/workspace.options";
import seo from "@/utils/seo";

export const Route = createFileRoute({
  ssr: false,
  loader: async ({ params: { workspaceId }, context }) => {
    const { workspace } = await context.queryClient.ensureQueryData(
      workspaceOptions(workspaceId),
    );

    if (!workspace) {
      throw notFound();
    }

    return { name: workspace.name };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [...seo({ title: loaderData.name })] : undefined,
  }),
  notFoundComponent: () => <NotFound>Workspace Not Found</NotFound>,
  component: WorkspacePage,
});

function WorkspacePage() {
  return (
    <div className="flex h-full items-center justify-center">
      TODO: Workspace Overview
    </div>
  );
}
