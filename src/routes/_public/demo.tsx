import { Badge } from "@omnidotdev/thornberry/badge";
import { createFileRoute } from "@tanstack/react-router";

import { DemoBoard } from "@/components/landing";
import app from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";
import createMetaTags from "@/lib/util/createMetaTags";

export const Route = createFileRoute("/_public/demo")({
  head: () => ({
    meta: [
      ...createMetaTags({
        title: "Demo",
        description: `Try ${app.name}: an interactive Kanban board. Drag tasks between columns and open one to see its details.`,
        url: `${BASE_URL}/demo`,
      }),
    ],
  }),
  component: DemoPage,
});

/**
 * Demo board page.
 */
function DemoPage() {
  return (
    <div className="relative px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <Badge className="mb-4 border-primary-500/20 bg-primary-500/10 text-primary-700 dark:border-primary-400/20 dark:text-primary-400">
            Interactive Demo
          </Badge>

          <h1 className="mb-4 font-bold text-3xl text-foreground sm:text-4xl">
            Experience {app.name}
          </h1>

          <p className="text-base-600 dark:text-base-400">
            Drag tasks between columns, click to view details. This is a fully
            interactive preview of Runa's Kanban board.
          </p>
        </div>

        <div className="flex justify-center">
          <DemoBoard />
        </div>

        <p className="mt-6 text-center text-base-500 text-sm">
          Sign up to create your own boards with unlimited customization.
        </p>
      </div>
    </div>
  );
}
