import {
  Outlet,
  createFileRoute,
  notFound,
  redirect,
} from "@tanstack/react-router";
import { useMemo } from "react";

import { AppSidebar } from "@/components/core";
import { NotFound } from "@/components/layout";
import { SidebarInset } from "@/components/ui/sidebar";
import { CreateProjectDialog } from "@/components/workspaces";
import settingByOrganizationIdOptions from "@/lib/options/settingByOrganizationId.options";
import OrganizationProvider from "@/providers/OrganizationProvider";
import SidebarProvider from "@/providers/SidebarProvider";
import { getOrganizationBySlug } from "@/server/functions/organizations";
import { provisionSettings } from "@/server/functions/settings";

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
    // We need to resolve it to organizationId to query the settings
    const orgFromSlug = workspaceSlug
      ? session.organizations?.find((org) => org.slug === workspaceSlug)
      : undefined;

    // validate the user belongs to the organization when applicable
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

      let { settingByOrganizationId } = await queryClient.ensureQueryData({
        ...settingByOrganizationIdOptions({ organizationId }),
      });

      // Auto-provision settings if they don't exist for this organization
      if (!settingByOrganizationId) {
        await provisionSettings({
          data: { organizationId },
        });

        // Invalidate and refetch to get settings with proper shape
        await queryClient.invalidateQueries({
          queryKey: settingByOrganizationIdOptions({ organizationId }).queryKey,
        });

        // Refetch the settings with full data
        const result = await queryClient.fetchQuery({
          ...settingByOrganizationIdOptions({ organizationId }),
        });
        settingByOrganizationId = result.settingByOrganizationId;
      }

      // Settings must exist at this point (auto-provisioned)
      // But membership is validated via JWT claims - if org not in claims and not fetchable, already threw notFound

      return {
        organizationId,
        settingByOrganizationId,
        fetchedOrg,
        projectSlug,
      };
    } else {
      return {
        organizationId: undefined,
        settingByOrganizationId: undefined,
        fetchedOrg: null,
        projectSlug: undefined,
      };
    }
  },
  loader: async ({ context }) => {
    return {
      organizationId: context.organizationId,
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
      </SidebarProvider>
    </OrganizationProvider>
  );
}
