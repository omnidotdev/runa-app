import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { LayersIcon, PlusIcon } from "lucide-react";

import { Link, WorkspaceTier } from "@/components/core";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/config/env.config";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import workspaceByOrganizationIdOptions from "@/lib/options/workspaceByOrganizationId.options";
import workspacesOptions from "@/lib/options/workspaces.options";
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
  beforeLoad: async ({ context: { session } }) => {
    if (!session?.user.rowId) return;

    // Get user's org IDs for filtering workspaces
    // Onboarding is now handled by Gatekeeper IDP - users should have orgs by the time they reach the app
    const organizationIds = session.organizations?.map((o) => o.id) ?? [];

    return { organizationIds };
  },
  loader: async ({ context }) => {
    const { queryClient } = context;
    // organizationIds comes from beforeLoad return value
    const organizationIds =
      (context as { organizationIds?: string[] }).organizationIds ?? [];
    return queryClient.ensureQueryData({
      ...workspacesOptions({ limit: 4, organizationIds }),
    });
  },
});

function WorkspacesOverviewPage() {
  const queryClient = useQueryClient();
  const orgContext = useOrganization();

  // Get user's org IDs for filtering workspaces
  const organizationIds = orgContext?.organizations?.map((o) => o.id) ?? [];

  const { data: recentWorkspaces } = useSuspenseQuery({
    ...workspacesOptions({ limit: 4, organizationIds }),
    select: (data) => data?.workspaces?.nodes,
  });

  const { setIsOpen: setIsCreateWorkspaceOpen } = useDialogStore({
    type: DialogType.CreateWorkspace,
  });

  // Helper to resolve org details from JWT claims
  const getOrgDetails = (organizationId: string) =>
    orgContext?.getOrganizationById(organizationId);

  return (
    <div className="flex h-full items-center justify-center p-12">
      <div className="w-full max-w-4xl">
        <div className="mb-12 flex flex-col items-center justify-center gap-4">
          <LayersIcon className="size-12 text-base-500 dark:text-base-400" />

          <h1 className="text-pretty text-center font-semibold text-2xl text-base-900 dark:text-base-100">
            {recentWorkspaces?.length
              ? "Select a workspace"
              : "Create a workspace to get started"}
          </h1>
        </div>

        {!!recentWorkspaces?.length && (
          <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] justify-center gap-6">
            {recentWorkspaces?.map((workspace) => {
              const org = getOrgDetails(workspace.organizationId);
              const orgName = org?.name;
              const orgSlug = org?.slug;

              return (
                <Link
                  key={workspace.rowId}
                  to="/workspaces/$workspaceSlug/projects"
                  params={{ workspaceSlug: orgSlug! }}
                  preload="intent"
                  onMouseEnter={() => {
                    queryClient.prefetchQuery(
                      workspaceByOrganizationIdOptions({
                        organizationId: workspace.organizationId,
                        projectSlug: undefined,
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

                    <WorkspaceTier
                      tier={workspace.tier}
                      className="absolute top-2 right-2"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <Button
          variant="outline"
          className="flex w-full border-primary border-dashed bg-primary/5 p-12 hover:bg-primary/5 active:scale-[0.99]"
          onClick={() => setIsCreateWorkspaceOpen(true)}
        >
          <PlusIcon className="size-4" />
          Create New Workspace
        </Button>
      </div>
    </div>
  );
}
