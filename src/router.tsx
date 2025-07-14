import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";

import DefaultCatchBoundary from "@/components/layout/DefaultCatchBoundary";
import NotFound from "@/components/layout/NotFound";
import getQueryClient from "@/lib/util/getQueryClient";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
  const queryClient = getQueryClient();

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
  });

  return routerWithQueryClient(router, queryClient);
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
