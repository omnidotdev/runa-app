import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";
import { all } from "better-all";

import projectsSidebarOptions from "@/lib/options/projectsSidebar.options";
import settingByOrganizationIdOptions from "@/lib/options/settingByOrganizationId.options";
import {
  fetchOrganizationBySlug,
  getOrganizationBySlug,
} from "@/server/functions/organizations";

/**
 * Workspace-scoped layout. Owns the `$workspaceSlug` URL segment so its
 * route match identity varies per workspace. The parent `_app.tsx` cannot
 * resolve `organizationId` itself: its match has no parameter of its own
 * and is therefore reused (with the active URL's params) when preloading
 * a different workspace, leaving descendants' contexts pointing at the
 * active workspace. Owning the segment here ensures `beforeLoad`/`loader`
 * run with the destination workspace's params.
 */
export const Route = createFileRoute("/_app/workspaces/$workspaceSlug")({
  beforeLoad: async ({
    params: { workspaceSlug },
    context: { session, isPublicAccess },
  }) => {
    if (isPublicAccess) {
      const fetchedOrg = await fetchOrganizationBySlug({
        data: { slug: workspaceSlug },
      });
      if (!fetchedOrg) throw notFound();
      return { organizationId: fetchedOrg.id, fetchedOrg };
    }

    const orgFromClaim = session?.organizations?.find(
      (org) => org.slug === workspaceSlug,
    );
    if (orgFromClaim) {
      return { organizationId: orgFromClaim.id };
    }

    const fetchedOrg = await getOrganizationBySlug({
      data: { slug: workspaceSlug },
    });
    if (!fetchedOrg) throw notFound();
    return { organizationId: fetchedOrg.id, fetchedOrg };
  },
  loader: async ({
    context: { queryClient, organizationId, session, isPublicAccess },
  }) => {
    if (isPublicAccess || !organizationId) return { organizationId };

    // Both queries are awaited in parallel: `ensureQueryData` for the
    // suspense-consumed setting (throws on error); `prefetchQuery` for the
    // non-suspense sidebar list (no-throw, but still awaited so SSR HTML
    // matches client hydration).
    await all({
      async setting() {
        return await queryClient.ensureQueryData(
          settingByOrganizationIdOptions({ organizationId }),
        );
      },
      async sidebarProjects() {
        return await queryClient.prefetchQuery(
          projectsSidebarOptions({
            organizationId,
            userId: session?.user?.rowId,
          }),
        );
      },
    });

    return { organizationId };
  },
  notFoundComponent: () => null,
  component: WorkspaceLayout,
});

function WorkspaceLayout() {
  return <Outlet />;
}
