import {
  Outlet,
  createFileRoute,
  notFound,
  redirect,
} from "@tanstack/react-router";
import { useMemo } from "react";

import { AppSidebar, CreateWorkspaceDialog } from "@/components/core";
import { NotFound } from "@/components/layout";
import { SidebarInset } from "@/components/ui/sidebar";
import { CreateProjectDialog } from "@/components/workspaces";
import invitationsOptions from "@/lib/options/invitations.options";
import membersOptions from "@/lib/options/members.options";
import workspaceOptions from "@/lib/options/workspace.options";
import workspaceByOrganizationIdOptions from "@/lib/options/workspaceByOrganizationId.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import OrganizationProvider from "@/providers/OrganizationProvider";
import SidebarProvider from "@/providers/SidebarProvider";
import { getOrganizationBySlug } from "@/server/functions/organizations";
import { provisionWorkspace } from "@/server/functions/workspaces";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ params, context: { queryClient, session } }) => {
    if (!session?.user.rowId) throw redirect({ to: "/" });

    // if session exists but `rowId` is missing, the user may exist in the identity provider but not in the database (stale cookie or incomplete signup), so signed out to clear the stale session
    if (!session.user.rowId) {
      const { signOutAndRedirect } = await import("@/server/functions/auth");
      await signOutAndRedirect();
    }

    const { workspaceSlug, projectSlug } = params as unknown as {
      workspaceSlug?: string;
      projectSlug?: string;
    };

    // workspaceSlug in the URL is actually the org slug from JWT claims
    // We need to resolve it to organizationId to query the workspace
    // Note: orgFromSlug may be undefined if JWT claims are stale (user just created the org)
    const orgFromSlug = workspaceSlug
      ? session.organizations?.find((org) => org.slug === workspaceSlug)
      : undefined;

    // validate the user belongs to the workspace when applicable
    if (workspaceSlug) {
      // If org not in JWT claims (stale token after creating new org),
      // fetch it directly from Gatekeeper
      let organizationId = orgFromSlug?.id;
      let fetchedOrg: Awaited<ReturnType<typeof getOrganizationBySlug>> = null;
      if (!organizationId) {
        fetchedOrg = await getOrganizationBySlug({
          data: { slug: workspaceSlug },
        });
        if (!fetchedOrg) throw notFound();
        organizationId = fetchedOrg.id;
      }

      let [{ workspaceByOrganizationId }] = await Promise.all([
        queryClient.ensureQueryData({
          ...workspaceByOrganizationIdOptions({
            organizationId,
            projectSlug,
          }),
        }),
        queryClient.prefetchQuery({
          ...workspacesOptions({ userId: session.user.rowId! }),
        }),
      ]);

      // Auto-provision workspace if it doesn't exist for this organization
      if (!workspaceByOrganizationId) {
        await provisionWorkspace({
          data: { organizationId },
        });

        // Invalidate and refetch to get workspace with proper shape
        await queryClient.invalidateQueries({
          queryKey: workspaceByOrganizationIdOptions({
            organizationId,
          }).queryKey,
        });
        await queryClient.invalidateQueries({
          queryKey: workspacesOptions({ userId: session.user.rowId! }).queryKey,
        });

        // Refetch the workspace with full data
        const result = await queryClient.fetchQuery({
          ...workspaceByOrganizationIdOptions({
            organizationId,
            projectSlug,
          }),
        });
        workspaceByOrganizationId = result.workspaceByOrganizationId;
      }

      if (!workspaceByOrganizationId) throw notFound();

      const [{ members }] = await Promise.all([
        queryClient.ensureQueryData({
          ...membersOptions({
            workspaceId: workspaceByOrganizationId.rowId,
            filter: {
              userId: { equalTo: session.user.rowId! },
            },
          }),
        }),
        queryClient.prefetchQuery({
          ...membersOptions({
            workspaceId: workspaceByOrganizationId.rowId,
          }),
        }),
        queryClient.prefetchQuery({
          ...workspaceOptions({
            rowId: workspaceByOrganizationId.rowId,
            userId: session.user.rowId!,
          }),
        }),
      ]);

      if (!members?.nodes.length) throw notFound();

      return { workspaceByOrganizationId, fetchedOrg };
    } else {
      await queryClient.ensureQueryData({
        ...workspacesOptions({ userId: session.user.rowId! }),
      });

      return { workspaceByOrganizationId: undefined, fetchedOrg: null };
    }
  },
  loader: async ({ context }) => {
    context.queryClient.prefetchQuery({
      ...invitationsOptions({ email: context.session?.user.email! }),
    });

    return {
      workspaceId: context.workspaceByOrganizationId?.rowId,
      fetchedOrg: context.fetchedOrg,
    };
  },
  notFoundComponent: () => <NotFound>Workspace Not Found</NotFound>,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { session } = Route.useRouteContext();
  const { fetchedOrg } = Route.useLoaderData();

  // Merge JWT organizations with any dynamically fetched org (for stale JWT cases)
  const organizations = useMemo(() => {
    const orgs = [...(session?.organizations ?? [])];
    if (fetchedOrg && !orgs.some((o) => o.id === fetchedOrg.id)) {
      // augment with missing fields to match `OrganizationClaim` shape
      orgs.push({
        ...fetchedOrg,
        // user just created this org, mark as owner
        roles: ["owner"],
        teams: [],
      });
    }
    return orgs;
  }, [session?.organizations, fetchedOrg]);

  return (
    <OrganizationProvider organizations={organizations}>
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
    </OrganizationProvider>
  );
}
