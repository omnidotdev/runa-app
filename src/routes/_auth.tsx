import { Outlet } from "@tanstack/react-router";

import { AppSidebar } from "@/components/AppSidebar";
import CreateProjectDialog from "@/components/CreateProjectDialog";
import CreateWorkspaceDialog from "@/components/CreateWorkspaceDialog";
import { SidebarInset } from "@/components/ui/sidebar";
import SidebarProvider from "@/providers/SidebarProvider";

export const Route = createFileRoute({
  ssr: false,
  component: AuthenticatedLayout,
});

async function AuthenticatedLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-dvh w-full">
        <AppSidebar variant="inset" />

        <SidebarInset className="flex-1 overflow-hidden">
          <Outlet />
        </SidebarInset>
      </div>

      <CreateProjectDialog />
      <CreateWorkspaceDialog />
    </SidebarProvider>
  );
}
