import { Outlet } from "@tanstack/react-router";

import { AppSidebar } from "@/components/AppSidebar";
import CreateWorkspaceDialog from "@/components/CreateWorkspaceDialog";
import { SidebarInset } from "@/components/ui/sidebar";
import workspaceOptions from "@/lib/options/workspace.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import SidebarProvider from "@/providers/SidebarProvider";

export const Route = createFileRoute({
  loader: async ({ params, context: { queryClient } }) => {
    // TODO: determine if there is a cleaner way to do this with ts router / start from layout files
    const { workspaceId } = params as unknown as { workspaceId?: string };

    await Promise.all([
      queryClient.prefetchQuery(workspacesOptions),
      ...(workspaceId
        ? [queryClient.prefetchQuery(workspaceOptions(workspaceId))]
        : []),
    ]);
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-dvh w-full">
        <AppSidebar variant="inset" />

        <SidebarInset className="flex-1 overflow-hidden">
          <Outlet />
        </SidebarInset>
      </div>

      <CreateWorkspaceDialog />
    </SidebarProvider>
  );
}
