import { createFileRoute } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";

import auth from "@/lib/auth/auth";

/**
 * Server logging middleware.
 */
const loggingMiddleware = createMiddleware().server(
  async ({ request, next }) => {
    const startTime = Date.now();

    try {
      return await next();
    } catch (error) {
      const duration = Date.now() - startTime;

      console.error(
        `[auth] ${request.method} ${request.url} - Error (${duration}ms):`,
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
