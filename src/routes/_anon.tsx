import { Outlet } from "@tanstack/react-router";

import Link from "@/components/core/Link";
import ThemeToggle from "@/components/ThemeToggle";

export const Route = createFileRoute({
  component: UnauthenticatedLayout,
});

function UnauthenticatedLayout() {
  return (
    <>
      <header className="fixed top-0 z-50 w-full border-base-200 border-b bg-white shadow-sm blur-ms dark:border-base-700 dark:bg-base-900">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              to="/"
              variant="ghost"
              className="hover:bg-accent/0 dark:hover:bg-accent/0"
            >
              <h1 className="font-bold text-primary-600 text-xl dark:text-primary-400">
                Runa
              </h1>
            </Link>
            <div className="flex items-center space-x-6">
              <ThemeToggle />
              {/* TODO */}
              {/* <Link
                to="/docs"
                variant="link"
              >
                Docs
              </Link> */}

              <Link to="/workspaces">Sign In</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="relative flex h-dvh w-full flex-col gap-0 pl-[calc(100vw-100%)]">
        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="flex w-full items-center justify-center p-4">
          &copy; {new Date().getFullYear()} Runa
        </footer>
      </div>
    </>
  );
}
