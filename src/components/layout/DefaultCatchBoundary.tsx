import { rootRouteId, useMatch, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

import type { ErrorComponentProps } from "@tanstack/react-router";

/**
 * Default error boundary for caught route errors.
 */
const DefaultCatchBoundary = ({ error }: ErrorComponentProps) => {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-8">
      <div className="text-center">
        <div className="mb-6 text-6xl">🌙</div>
        <h1 className="text-destructive text-2xl font-bold">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          An unexpected error occurred. Please try again
          {isRoot ? " or return to the home page" : ""}.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => router.invalidate()}
            className="border-border bg-card text-foreground hover:bg-accent rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
          >
            Try again
          </button>
          {isRoot ? (
            <a
              href="/"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              Go Home
            </a>
          ) : (
            <button
              type="button"
              onClick={() => window.history.back()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              Go back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefaultCatchBoundary;
