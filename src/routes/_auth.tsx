import {
  Outlet,
  createFileRoute,
  notFound,
  redirect,
} from "@tanstack/react-router";

import AppSidebar from "@/components/core/AppSidebar";
import CreateWorkspaceDialog from "@/components/core/CreateWorkspaceDialog";
import NotFound from "@/components/layout/NotFound";
import { SidebarInset } from "@/components/ui/sidebar";
import CreateProjectDialog from "@/components/workspaces/CreateProjectDialog";
import invitationsOptions from "@/lib/options/invitations.options";
import workspaceOptions from "@/lib/options/workspace.options";
import workspaceBySlugOptions from "@/lib/options/workspaceBySlug.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import workspaceUsersOptions from "@/lib/options/workspaceUsers.options";
import SidebarProvider from "@/providers/SidebarProvider";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ params, context: { queryClient, session } }) => {
    if (!session) throw redirect({ to: "/" });

    if (!session.user.rowId) {
      throw new Error("User `rowId` not found in session");
    }

    const { workspaceSlug, projectSlug } = params as unknown as {
      workspaceSlug?: string;
      projectSlug?: string;
    };

    // validate that the user belongs to the workspace when applicable
    if (workspaceSlug) {
      const { workspaceBySlug } = await queryClient.ensureQueryData(
        workspaceBySlugOptions({
          slug: workspaceSlug,
          projectSlug,
        }),
      );

      if (!workspaceBySlug) throw notFound();

      const [{ workspaceUsers }] = await Promise.all([
        // ensure user is a member of the workspace
        queryClient.ensureQueryData(
          workspaceUsersOptions({
            workspaceId: workspaceBySlug.rowId,
            filter: {
              userId: { equalTo: session.user.rowId! },
            },
          }),
        ),
        queryClient.ensureQueryData(
          workspaceUsersOptions({
            workspaceId: workspaceBySlug.rowId,
          }),
        ),
        queryClient.ensureQueryData(
          workspaceOptions({
            rowId: workspaceBySlug.rowId,
            userId: session.user.rowId!,
          }),
        ),
        queryClient.ensureQueryData(
          workspacesOptions({ userId: session.user.rowId! }),
        ),
      ]);

      if (!workspaceUsers?.nodes.length) throw notFound();

      return { workspaceBySlug };
    } else {
      await queryClient.ensureQueryData(
        workspacesOptions({ userId: session.user.rowId }),
      );

      return { workspaceBySlug: undefined };
    }
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      invitationsOptions({ email: context.session?.user.email! }),
    );

    return {
      workspaceId: context.workspaceBySlug?.rowId,
    };
  },
  notFoundComponent: () => <NotFound>Workspace Not Found</NotFound>,
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

      <CreateProjectDialog />
      <CreateWorkspaceDialog />
    </SidebarProvider>
  );
}
