import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";
import { all } from "better-all";
import { useMemo } from "react";

import { AppSidebar } from "@/components/core";
import { NotFound } from "@/components/layout";
import { SidebarInset } from "@/components/ui/sidebar";
import { CreateProjectDialog } from "@/components/workspaces";
import projectsSidebarOptions from "@/lib/options/projectsSidebar.options";
import settingByOrganizationIdOptions from "@/lib/options/settingByOrganizationId.options";
import OrganizationProvider from "@/providers/OrganizationProvider";
import SidebarProvider from "@/providers/SidebarProvider";
import { getOrganizationBySlug } from "@/server/functions/organizations";
import { provisionSettings } from "@/server/functions/settings";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ params, context: { session } }) => {
    // if session exists but `rowId` is missing, the user may exist in the identity provider but not in the database (stale cookie or incomplete signup), so signed out to clear the stale session
    if (!session?.user?.rowId) {
      const { signOutAndRedirect } = await import("@/server/functions/auth");
      await signOutAndRedirect();
    }

    const { workspaceSlug, projectSlug } = params as {
      workspaceSlug?: string;
      projectSlug?: string;
    };

    if (!workspaceSlug) {
      return { organizationId: undefined, projectSlug: undefined };
    }

    // workspaceSlug in the URL is actually the org slug from JWT claims
    // We need to resolve it to organizationId to query the settings
    const orgFromClaim = workspaceSlug
      ? session?.organizations?.find((org) => org.slug === workspaceSlug)
      : undefined;

    if (orgFromClaim) {
      return { organizationId: orgFromClaim.id, projectSlug };
    }

    // Fallback: org not in JWT → must fetch
    const fetchedOrg = await getOrganizationBySlug({
      data: { slug: workspaceSlug },
    });

    if (!fetchedOrg) throw notFound();

    return { organizationId: fetchedOrg.id, projectSlug, fetchedOrg };
  },
  loader: async ({
    context: { queryClient, organizationId, fetchedOrg, session },
  }) => {
    if (!organizationId) {
      return {
        organizationId: undefined,
        settingByOrganizationId: undefined,
        fetchedOrg: undefined,
      };
    }

    let {
      setting: { settingByOrganizationId },
    } = await all({
      async setting() {
        return await queryClient.ensureQueryData({
          ...settingByOrganizationIdOptions({ organizationId }),
        });
      },
      async sidebarProjects() {
        return await queryClient.ensureQueryData(
          projectsSidebarOptions({
            organizationId,
            userId: session?.user?.rowId,
          }),
        );
      },
    });

    if (!settingByOrganizationId) {
      const newSettings = await provisionSettings({ data: { organizationId } });

      if (newSettings) {
        queryClient.setQueryData(
          settingByOrganizationIdOptions({ organizationId }).queryKey,
          { settingByOrganizationId: newSettings },
        );
        settingByOrganizationId = newSettings;
      }
    }

    return {
      organizationId,
      settingByOrganizationId,
      fetchedOrg,
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

    if (fetchedOrg && !orgs.some((o) => o.id === fetchedOrg!.id)) {
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
      </SidebarProvider>
    </OrganizationProvider>
  );
}
