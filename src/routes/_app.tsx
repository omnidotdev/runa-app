import { Outlet, createFileRoute, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";

import { AppSidebar, Link, Logo, ThemeToggle } from "@/components/core";
import { NotFound } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { SidebarInset } from "@/components/ui/sidebar";
import { CreateProjectDialog } from "@/components/workspaces";
import signIn from "@/lib/auth/signIn";
import app from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";
import { EventsProvider } from "@/providers/EventsProvider";
import OrganizationProvider from "@/providers/OrganizationProvider";
import SidebarProvider from "@/providers/SidebarProvider";

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

    if (!session?.user?.rowId) {
      // Public project URLs (workspace + project segments present) are
      // handled downstream by `$workspaceSlug.tsx`, which fetches the org
      // without auth and short-circuits on `isPublicAccess`.
      if (workspaceSlug && projectSlug) {
        return { isPublicAccess: true };
      }

      const { signOutAndRedirect } = await import("@/server/functions/auth");
      await signOutAndRedirect();
    }

    return {};
  },
  notFoundComponent: () => <NotFound>Workspace Not Found</NotFound>,
  component: AppLayout,
});

function AppLayout() {
  const { session } = Route.useRouteContext();

  const isAuthenticated = !!session?.user?.rowId;
  const search = useSearch({ strict: false }) as { mode?: string };
  const isPublicPreview = search.mode === "public";

  const organizations = useMemo(
    () => session?.organizations ?? [],
    [session?.organizations],
  );

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
          <div className="flex h-14 items-center justify-between px-6">
            <Link
              to="/"
              variant="ghost"
              className="-ml-4 gap-2 hover:bg-transparent dark:hover:bg-transparent"
            >
              <Logo className="size-6 text-primary-500" />
              <span className="font-bold text-lg tracking-tight">
                {app.name}
              </span>
            </Link>

            <div className="-mr-2 flex items-center gap-2">
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

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
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
