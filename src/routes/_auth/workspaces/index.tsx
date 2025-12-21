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
import workspaceBySlugOptions from "@/lib/options/workspaceBySlug.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import createMetaTags from "@/lib/util/createMetaTags";

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
  loader: async ({ context: { queryClient, session } }) =>
    await queryClient.ensureQueryData({
      ...workspacesOptions({ userId: session?.user?.rowId!, limit: 4 }),
    }),
});

function WorkspacesOverviewPage() {
  const { session } = Route.useRouteContext();
  const queryClient = useQueryClient();

  const { data: recentWorkspaces } = useSuspenseQuery({
    ...workspacesOptions({ userId: session?.user?.rowId!, limit: 4 }),
    select: (data) => data?.workspaces?.nodes,
  });

  const { setIsOpen: setIsCreateWorkspaceOpen } = useDialogStore({
    type: DialogType.CreateWorkspace,
  });

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
            {recentWorkspaces?.map((workspace) => (
              <Link
                key={workspace.rowId}
                to="/workspaces/$workspaceSlug/projects"
                params={{ workspaceSlug: workspace.slug }}
                preload="intent"
                onMouseEnter={() => {
                  queryClient.prefetchQuery(
                    workspaceBySlugOptions({
                      slug: workspace.slug,
                      projectSlug: undefined,
                    }),
                  );
                }}
                variant="outline"
                className="relative flex h-32 flex-col p-4"
              >
                <AvatarRoot size="lg">
                  <AvatarImage src={undefined} alt={workspace?.name} />
                  <AvatarFallback>
                    {" "}
                    <div className="flex size-full items-center justify-center border font-semibold uppercase">
                      {workspace?.name?.charAt(0)}
                    </div>
                  </AvatarFallback>
                </AvatarRoot>

                <div className="flex flex-1 flex-col items-center">
                  <h3 className="truncate font-semibold text-base-900 dark:text-base-100">
                    {workspace?.name}
                  </h3>

                  <p className="mt-1 text-base-600 text-sm dark:text-base-400">
                    {workspace?.workspaceUsers?.totalCount} members
                  </p>

                  <WorkspaceTier
                    tier={workspace.tier}
                    className="absolute top-2 right-2"
                  />
                </div>
              </Link>
            ))}
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
