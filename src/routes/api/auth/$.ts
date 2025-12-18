import { createFileRoute } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";

import auth from "@/lib/auth/auth";

/**
 * Server logging middleware.
 */
const loggingMiddleware = createMiddleware().server(
  async ({ request, next }) => {
    const startTime = Date.now();

    const timestamp = new Date().toISOString();

    try {
      const response = await next();

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;

      console.error(
        `[${timestamp}] ${request.method} ${request.url} - Error (${duration}ms):`,
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
