import { Outlet, createFileRoute } from "@tanstack/react-router";

import { Link, ThemeToggle } from "@/components/core";
import { Button } from "@/components/ui/button";
import signIn from "@/lib/auth/signIn";
import signOut from "@/lib/auth/signOut";
import app from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";

export const Route = createFileRoute("/_shared")({
  component: SharedLayout,
});

function SharedLayout() {
  const { session } = Route.useRouteContext();

  const handleSignIn = async () => {
    try {
      await signIn({ redirectUrl: BASE_URL, providerId: "omni" });
    } catch (error) {
      console.error("[handleSignIn] OAuth sign-in failed:", error);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            variant="ghost"
            className="gap-2 hover:bg-transparent dark:hover:bg-transparent"
          >
            <span className="text-xl">🌙</span>
            <span className="font-bold text-lg tracking-tight">{app.name}</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {session ? (
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSignIn}
                className="bg-primary-500 text-base-950 hover:bg-primary-400 dark:bg-primary-500 dark:hover:bg-primary-400"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
