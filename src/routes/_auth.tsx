import { notFound, Outlet, redirect } from "@tanstack/react-router";

import { AppSidebar } from "@/components/AppSidebar";
import CreateProjectDialog from "@/components/CreateProjectDialog";
import CreateWorkspaceDialog from "@/components/CreateWorkspaceDialog";
import NotFound from "@/components/layout/NotFound";
import { SidebarInset } from "@/components/ui/sidebar";
import useProjectStore from "@/lib/hooks/store/useProjectStore";
import workspaceOptions from "@/lib/options/workspace.options";
import workspaceBySlugOptions from "@/lib/options/workspaceBySlug.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import SidebarProvider from "@/providers/SidebarProvider";

export const Route = createFileRoute({
  beforeLoad: ({ context: { session } }) => {
    if (!session) throw redirect({ to: "/" });
  },
  loader: async ({ params, context: { queryClient, session } }) => {
    // TODO: determine if there is a cleaner way to do this with ts router / start from layout files
    const { workspaceSlug } = params as unknown as { workspaceSlug?: string };

    // validate that the user belongs to the workspace when applicable
    if (workspaceSlug) {
      const { workspaceBySlug } = await queryClient.ensureQueryData(
        workspaceBySlugOptions({ slug: workspaceSlug }),
      );

      if (!workspaceBySlug) throw notFound();

      const [{ workspace }] = await Promise.all([
        queryClient.ensureQueryData(
          workspaceOptions({
            rowId: workspaceBySlug.rowId,
            userFilter: {
              userId: { equalTo: session?.user.rowId! },
            },
          }),
        ),
        queryClient.ensureQueryData(
          workspaceOptions({ rowId: workspaceBySlug.rowId }),
        ),
        queryClient.ensureQueryData(
          workspacesOptions({ userId: session?.user.rowId! }),
        ),
      ]);

      if (!workspace?.workspaceUsers.nodes.length) throw notFound();

      return { workspaceId: workspaceBySlug.rowId };
    } else {
      await queryClient.ensureQueryData(
        workspacesOptions({ userId: session?.user.rowId! }),
      );

      return { workspaceId: undefined };
    }
  },
  notFoundComponent: () => <NotFound>Workspace Not Found</NotFound>,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { status } = useProjectStore();

  return (
    <SidebarProvider>
      <div className="flex h-dvh w-full">
        <AppSidebar variant="inset" />

        <SidebarInset className="flex-1 overflow-hidden">
          <Outlet />
        </SidebarInset>
      </div>

      <CreateProjectDialog status={status ?? undefined} />
      <CreateWorkspaceDialog />
    </SidebarProvider>
  );
}
