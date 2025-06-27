import { Outlet } from "@tanstack/react-router";

import { AppSidebar } from "@/components/AppSidebar";
import CreateProjectDialog from "@/components/CreateProjectDialog";
import CreateWorkspaceDialog from "@/components/CreateWorkspaceDialog";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const Route = createFileRoute({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex h-dvh w-full">
        <SidebarTrigger />

        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </main>

      <CreateWorkspaceDialog />
      <CreateProjectDialog />
    </SidebarProvider>
  );
}
