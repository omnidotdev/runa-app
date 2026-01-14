import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { LayersIcon, PlusIcon } from "lucide-react";

import { Link } from "@/components/core";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AUTH_BASE_URL, BASE_URL } from "@/lib/config/env.config";
import settingByOrganizationIdOptions from "@/lib/options/settingByOrganizationId.options";
import createMetaTags from "@/lib/util/createMetaTags";
import { useOrganization } from "@/providers/OrganizationProvider";

export const Route = createFileRoute("/_auth/workspaces/")({
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
  const queryClient = useQueryClient();
  const orgContext = useOrganization();

  // Get user's organizations from JWT claims
  const organizations = orgContext?.organizations ?? [];

  return (
    <div className="flex h-full items-center justify-center p-12">
      <div className="w-full max-w-4xl">
        <div className="mb-12 flex flex-col items-center justify-center gap-4">
          <LayersIcon className="size-12 text-base-500 dark:text-base-400" />

          <h1 className="text-pretty text-center font-semibold text-2xl text-base-900 dark:text-base-100">
            {organizations.length
              ? "Select a workspace"
              : "Create a workspace to get started"}
          </h1>
        </div>

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
                  onMouseEnter={() => {
                    queryClient.prefetchQuery(
                      settingByOrganizationIdOptions({
                        organizationId: org.id,
                      }),
                    );
                  }}
                  variant="outline"
                  className="relative flex h-32 flex-col p-4"
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

        <Button
          asChild
          variant="outline"
          className="flex w-full border-primary border-dashed bg-primary/5 p-12 hover:bg-primary/5 active:scale-[0.99]"
        >
          <a href={`${AUTH_BASE_URL}/profile`}>
            <PlusIcon className="size-4" />
            Create New Organization
          </a>
        </Button>
      </div>
    </div>
  );
}
