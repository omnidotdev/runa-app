import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Image } from "@unpic/react";

import { Link, ThemeToggle } from "@/components/core";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/signIn";
import { signOut } from "@/lib/auth/signOut";
import app from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";

// TODO rename to landing or index or home

const MarketingLayout = () => {
  const { session } = Route.useRouteContext();

  return (
    <>
      {/* Background Image */}
      <div className="fixed inset-0">
        <div
          className="absolute inset-0 left-[calc(-1*calc(100vw-100%))] z-0 w-[calc(100%+calc(100vw-100%))] opacity-50 dark:opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='200' height='200' patternUnits='userSpaceOnUse' patternTransform='rotate(12)'%3E%3Cpath d='M 200 0 L 0 0 0 200' fill='none' stroke='rgba(37, 99, 235, 0.45)' stroke-width='2.5' class='light-stroke'/%3E%3Cpath d='M 200 0 L 0 0 0 200' fill='none' stroke='rgba(96, 165, 250, 0.55)' stroke-width='2.5' class='dark-stroke' style='display:none'/%3E%3C/pattern%3E%3CradialGradient id='fade' cx='50%25' cy='50%25' r='70%25' fx='50%25' fy='50%25'%3E%3Cstop offset='0%25' style='stop-color:white;stop-opacity:0' /%3E%3Cstop offset='70%25' style='stop-color:white;stop-opacity:1' /%3E%3C/radialGradient%3E%3Cmask id='mask' x='0' y='0' width='100%25' height='100%25'%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='url(%23fade)'/%3E%3C/mask%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' mask='url(%23mask)'/%3E%3Cstyle%3E@media (prefers-color-scheme: dark) { .light-stroke { display: none; } .dark-stroke { display: block !important; } }%3C/style%3E%3C/svg%3E")`,
            backgroundSize: "cover",
          }}
        />
        <div className="absolute inset-0 left-[calc(-1*calc(100vw-100%))] z-0 w-[calc(100%+calc(100vw-100%))] bg-linear-to-b from-base-100/70 via-transparent to-base-100/70 dark:from-base-950/70 dark:via-transparent dark:to-base-900/70" />
      </div>

      <header className="fixed top-0 z-50 w-full border-base-200 border-b bg-white shadow-sm blur-ms dark:border-base-700 dark:bg-base-900">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              to="/"
              variant="ghost"
              className="hover:bg-accent/0 dark:hover:bg-accent/0"
            >
              <Image
                layout="fullWidth"
                src="/logo.png"
                alt={`${app.name} logo`}
                className="h-6 w-6 md:h-8 md:w-8"
              />
              <h1 className="font-bold text-xl">{app.name}</h1>
            </Link>

            <div className="flex items-center gap-4">
              <ThemeToggle />

              {session ? (
                <Button onClick={signOut}>Sign Out</Button>
              ) : (
                <Button onClick={() => signIn({ redirectUrl: BASE_URL })}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex h-dvh w-full flex-col gap-0 pl-[calc(100vw-100%)]">
        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="flex w-full items-center justify-center p-4 text-base-600 dark:text-base-400">
          &copy; {new Date().getFullYear()} {app.organization.name}
        </footer>
      </div>
    </>
  );
};

export const Route = createFileRoute("/_marketing")({
  component: MarketingLayout,
});
