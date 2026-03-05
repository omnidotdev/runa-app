import {
  Outlet,
  createFileRoute,
  notFound,
  useSearch,
} from "@tanstack/react-router";
import { all } from "better-all";
import { useMemo } from "react";

import { AppSidebar, Link, ThemeToggle } from "@/components/core";
import { NotFound } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { SidebarInset } from "@/components/ui/sidebar";
import { CreateProjectDialog } from "@/components/workspaces";
import signIn from "@/lib/auth/signIn";
import app from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";
import projectsSidebarOptions from "@/lib/options/projectsSidebar.options";
import settingByOrganizationIdOptions from "@/lib/options/settingByOrganizationId.options";
import { EventsProvider } from "@/providers/EventsProvider";
import OrganizationProvider from "@/providers/OrganizationProvider";
import SidebarProvider from "@/providers/SidebarProvider";
import {
  fetchOrganizationBySlug,
  getOrganizationBySlug,
} from "@/server/functions/organizations";

// Noop provider for client-side (main @omnidotdev/providers entry requires Node.js)
const eventsProvider = {
  async emit() {
    return {
      eventId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
  },
};

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ params, context: { session } }) => {
    const { workspaceSlug, projectSlug } = params as {
      workspaceSlug?: string;
      projectSlug?: string;
    };

    // If no session, allow through for potential public project access
    if (!session?.user?.rowId) {
      if (workspaceSlug && projectSlug) {
        // Might be a public project — resolve org without auth
        const fetchedOrg = await fetchOrganizationBySlug({
          data: { slug: workspaceSlug },
        });

        if (!fetchedOrg) throw notFound();

        return {
          organizationId: fetchedOrg.id,
          projectSlug,
          isPublicAccess: true,
        };
      }

      // No workspace/project params — redirect to sign in
      const { signOutAndRedirect } = await import("@/server/functions/auth");
      await signOutAndRedirect();
    }

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
    context: {
      queryClient,
      organizationId,
      fetchedOrg,
      session,
      isPublicAccess,
    },
  }) => {
    // Public access — skip sidebar/settings data
    if (isPublicAccess) {
      return {
        organizationId,
        settingByOrganizationId: undefined,
        fetchedOrg: undefined,
        isPublicAccess: true,
      };
    }

    if (!organizationId) {
      return {
        organizationId: undefined,
        settingByOrganizationId: undefined,
        fetchedOrg: undefined,
      };
    }

    const {
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

    return {
      organizationId,
      settingByOrganizationId,
      fetchedOrg,
    };
  },
  notFoundComponent: () => <NotFound>Workspace Not Found</NotFound>,
  component: AppLayout,
});

function AppLayout() {
  const { session } = Route.useRouteContext();
  const { fetchedOrg } = Route.useLoaderData();

  const isAuthenticated = !!session?.user?.rowId;
  const search = useSearch({ strict: false }) as { mode?: string };
  const isPublicPreview = search.mode === "public";

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

  const handleSignIn = async () => {
    try {
      await signIn({ redirectUrl: BASE_URL, providerId: "omni" });
    } catch (error) {
      console.error("[handleSignIn] OAuth sign-in failed:", error);
    }
  };

  if (!isAuthenticated || isPublicPreview) {
    // Minimal header for unauthenticated or public preview access
    return (
      <div className="flex h-dvh flex-col bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
          <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link
              to="/"
              variant="ghost"
              className="gap-2 hover:bg-transparent dark:hover:bg-transparent"
            >
              <span className="text-xl">🌙</span>
              <span className="font-bold text-lg tracking-tight">
                {app.name}
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                size="sm"
                onClick={handleSignIn}
                className="bg-primary-500 text-base-950 hover:bg-primary-400 dark:bg-primary-500 dark:hover:bg-primary-400"
              >
                Sign In
              </Button>
            </div>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <EventsProvider provider={eventsProvider}>
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
    </EventsProvider>
  );
}
