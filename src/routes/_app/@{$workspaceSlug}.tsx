import {
  Outlet,
  createFileRoute,
  notFound,
  redirect,
} from "@tanstack/react-router";
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
export const Route = createFileRoute("/_app/@{$workspaceSlug}")({
  beforeLoad: async ({
    params: { workspaceSlug },
    location,
    context: { session, isPublicAccess, authDegraded },
  }) => {
    if (isPublicAccess) {
      const fetchedOrg = await fetchOrganizationBySlug({
        data: { slug: workspaceSlug },
      });
      if (!fetchedOrg) throw notFound();
      return { organizationId: fetchedOrg.id, fetchedOrg };
    }

    // A degraded session (refresh-token grant failed, so no fresh access
    // token) still carries a cached rowId, so the `_app` gate lets it through,
    // but its authenticated workspace data fetches (the `settingByOrganizationId`
    // suspense query below) 401 and rethrow into the error boundary ("Something
    // went wrong"). The equivalent guard in `_app.tsx` is unreliable: that match
    // owns no param, so it is reused with stale params on client navigation and
    // preload and never re-evaluates `workspaceSlug`. This route owns the
    // segment, so its `beforeLoad` always runs with the destination workspace.
    // Route the degraded session to /workspaces, which recovers it
    // automatically (silent re-auth), and carry the requested path so recovery
    // returns the user here rather than to the picker
    if (authDegraded) {
      throw redirect({ to: "/workspaces", search: { from: location.href } });
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
