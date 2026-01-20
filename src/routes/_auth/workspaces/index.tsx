import { createFileRoute, redirect } from "@tanstack/react-router";
import { ExternalLinkIcon, InfoIcon, LayersIcon } from "lucide-react";

import { Link } from "@/components/core";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import { AUTH_BASE_URL, BASE_URL } from "@/lib/config/env.config";
import createMetaTags from "@/lib/util/createMetaTags";
import { useOrganization } from "@/providers/OrganizationProvider";
import {
  getLastWorkspaceCookie,
  setLastWorkspaceCookie,
} from "@/server/functions/lastWorkspace";

export const Route = createFileRoute("/_auth/workspaces/")({
  beforeLoad: async ({ context: { session } }) => {
    const organizations = session?.organizations ?? [];
    if (!organizations.length) return;

    const lastSlug = await getLastWorkspaceCookie();
    if (lastSlug && organizations.some((org) => org.slug === lastSlug)) {
      throw redirect({
        to: "/workspaces/$workspaceSlug/projects",
        params: { workspaceSlug: lastSlug },
      });
    }
  },
  head: () => ({
    meta: [
      ...createMetaTags({
        title: "Workspaces",
        description:
          "Create a new workspace, or select a current one to view details.",
        url: `${BASE_URL}/workspaces`,
      }),
    ],
  }),
  component: WorkspacesOverviewPage,
});

function WorkspacesOverviewPage() {
  const orgContext = useOrganization();

  // Get user's organizations from JWT claims
  const organizations = orgContext?.organizations ?? [];

  return (
    <div className="flex h-full flex-col">
      {/* Sticky header */}
      <div className="shrink-0 px-12 pt-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4">
          <LayersIcon className="size-12 text-base-500 dark:text-base-400" />

          <h1 className="text-pretty text-center font-semibold text-2xl text-base-900 dark:text-base-100">
            {organizations.length
              ? "Select a workspace"
              : "Create a workspace to get started"}
          </h1>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-12 py-8">
        <div className="mx-auto w-full max-w-4xl">
          {!!organizations.length && (
            <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] justify-center gap-6">
              {organizations.map((org) => {
                const orgName = org.name;
                const orgSlug = org.slug;

                return (
                  <Link
                    key={org.id}
                    to="/workspaces/$workspaceSlug/projects"
                    params={{ workspaceSlug: orgSlug! }}
                    preload="intent"
                    variant="outline"
                    className="relative flex h-32 flex-col p-4"
                    onClick={() => setLastWorkspaceCookie({ data: orgSlug! })}
                  >
                    <AvatarRoot size="lg">
                      <AvatarImage src={undefined} alt={orgName} />
                      <AvatarFallback>
                        {" "}
                        <div className="flex size-full items-center justify-center border font-semibold uppercase">
                          {orgName?.charAt(0)}
                        </div>
                      </AvatarFallback>
                    </AvatarRoot>

                    <div className="flex flex-1 flex-col items-center">
                      <h3 className="truncate font-semibold text-base-900 dark:text-base-100">
                        {orgName}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* TODO: Implement in-app organization creation once Gatekeeper API supports it */}
          <div className="flex flex-col items-center gap-4 rounded-lg border border-base-300 border-dashed bg-base-50 p-8 text-center dark:border-base-700 dark:bg-base-900">
            <InfoIcon className="size-6 text-base-500" />
            <div className="space-y-2">
              <p className="text-base-700 text-sm dark:text-base-300">
                Workspaces are currently managed via Omni Organizations.
              </p>
              <p className="text-base-500 text-xs">
                This experience will be improved soon.
              </p>
            </div>
            <a
              href={AUTH_BASE_URL}
              className="inline-flex items-center gap-2 text-primary text-sm hover:underline"
            >
              Manage Organizations
              <ExternalLinkIcon className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
