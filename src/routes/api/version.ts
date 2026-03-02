import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/version")({
  server: {
    handlers: {
      GET: () =>
        Response.json({
          name: "@omnidotdev/runa-app",
          version: process.env.BUILD_VERSION || "0.1.0",
        }),
    },
  },
});
