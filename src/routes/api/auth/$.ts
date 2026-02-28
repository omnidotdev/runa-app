import { createFileRoute } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";

import auth from "@/lib/auth/auth";

/**
 * Server logging middleware.
 */
const loggingMiddleware = createMiddleware().server(
  async ({ request, next }) => {
    const startTime = Date.now();
    const url = new URL(request.url);

    // Log all auth requests for diagnostics
    // biome-ignore lint/suspicious/noConsole: diagnostic logging for auth flow
    console.debug(
      `[auth] ${request.method} ${url.pathname}${url.search ? `?${url.searchParams.toString().slice(0, 100)}` : ""}`,
    );

    try {
      const response = await next();

      const duration = Date.now() - startTime;

      // Log response status for OAuth callback and sign-in endpoints
      if (response instanceof Response) {
        // biome-ignore lint/suspicious/noConsole: diagnostic logging for auth flow
        console.debug(
          `[auth] ${request.method} ${url.pathname} → ${response.status} (${duration}ms)${response.headers.get("location") ? ` → ${response.headers.get("location")?.slice(0, 100)}` : ""}`,
        );
      }

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;

      console.error(
        `[auth] ${request.method} ${url.pathname} - Error (${duration}ms):`,
        error,
      );

      throw error;
    }
  },
);

export const Route = createFileRoute("/api/auth/$")({
  server: {
    middleware: [loggingMiddleware],
    handlers: {
      GET: ({ request }) => auth.handler(request),
      POST: ({ request }) => auth.handler(request),
    },
  },
});
