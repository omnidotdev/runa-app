import {
  Outlet,
  createFileRoute,
  redirect,
  useSearch,
} from "@tanstack/react-router";
import { useEffect, useMemo } from "react";

import { AppSidebar, Link, Logo, ThemeToggle } from "@/components/core";
import { NotFound } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { SidebarInset } from "@/components/ui/sidebar";
import { CreateProjectDialog } from "@/components/workspaces";
import { clearReauthAttempt } from "@/lib/auth/reauthGuard";
import signIn from "@/lib/auth/signIn";
import app from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";
import { EventsProvider } from "@/providers/EventsProvider";
import SidebarProvider from "@/providers/SidebarProvider";
import WorkspaceProvider from "@/providers/WorkspaceProvider";

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
  beforeLoad: async ({ params, context: { session, authDegraded } }) => {
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

    // A degraded session (refresh-token grant failed, so no fresh access token)
    // still carries a cached rowId, so it passes the gate above, but its
    // authenticated workspace data fetches 401 and the suspense loaders rethrow
    // into the error boundary ("Something went wrong"). Route workspace-scoped
    // degraded sessions to /workspaces, which surfaces a graceful "Sign in
    // again" prompt (useReAuth) to mint fresh tokens. /workspaces has no
    // workspaceSlug, so it is exempt and there is no redirect loop.
    if (authDegraded && workspaceSlug) {
      throw redirect({ to: "/workspaces" });
    }

    return {};
  },
  notFoundComponent: () => <NotFound>Workspace Not Found</NotFound>,
  component: AppLayout,
});

function AppLayout() {
  const { session, authDegraded } = Route.useRouteContext();

  const isAuthenticated = !!session?.user?.rowId;

  // A healthy authenticated render means any prior degraded-session recovery
  // succeeded, so drop the one-shot guard to re-arm automatic recovery for a
  // future degrade.
  useEffect(() => {
    if (isAuthenticated && !authDegraded) clearReauthAttempt();
  }, [isAuthenticated, authDegraded]);
  const search = useSearch({ strict: false }) as { mode?: string };
  const isPublicPreview = search.mode === "public";

  const organizations = useMemo(
    () => session?.organizations ?? [],
    [session?.organizations],
  );

  // The app shell is a fixed-viewport layout with its own inner scroll areas, so
  // the global `html { overflow-y: scroll }` (kept for the scrolling marketing
  // pages) would add a second, redundant body scrollbar. Suppress it while the
  // app layout is mounted and restore it on unmount (e.g. navigating to landing).
  useEffect(() => {
    const { style } = document.documentElement;
    const previous = style.overflowY;
    style.overflowY = "hidden";
    return () => {
      style.overflowY = previous;
    };
  }, []);

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
      <WorkspaceProvider workspaces={organizations}>
        <SidebarProvider>
          <div className="flex h-dvh w-full">
            <AppSidebar variant="inset" />

            <SidebarInset className="flex-1 overflow-hidden">
              <Outlet />
            </SidebarInset>
          </div>

          <CreateProjectDialog />
        </SidebarProvider>
      </WorkspaceProvider>
    </EventsProvider>
  );
}
