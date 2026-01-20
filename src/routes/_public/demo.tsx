import { createFileRoute } from "@tanstack/react-router";

import { DemoBoard } from "@/components/landing";
import { Badge } from "@/components/ui/badge";
import app from "@/lib/config/app.config";

export const Route = createFileRoute("/_public/demo")({
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
