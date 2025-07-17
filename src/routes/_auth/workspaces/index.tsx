import { useSuspenseQuery } from "@tanstack/react-query";
import { BoxIcon, PlusIcon } from "lucide-react";

import Link from "@/components/core/Link";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardHeader, CardRoot } from "@/components/ui/card";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import workspacesOptions from "@/lib/options/workspaces.options";
import seo from "@/lib/util/seo";

export const Route = createFileRoute({
  head: () => ({
    meta: [...seo({ title: "Workspaces" })],
  }),
  component: WorkspacesOverviewPage,
  loader: async ({ context: { queryClient, session } }) =>
    await queryClient.ensureQueryData(
      workspacesOptions({ userId: session?.user?.rowId!, limit: 4 }),
    ),
});

function WorkspacesOverviewPage() {
  const { session } = Route.useRouteContext();

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
          <BoxIcon className="size-12 text-base-500 dark:text-base-400" />
          <h1 className="text-pretty text-center font-semibold text-2xl text-base-900 dark:text-base-100">
            {recentWorkspaces?.length
              ? "Select a workspace or create a new one to get started"
              : "Create a workspace to get started"}
          </h1>
        </div>

        {!!recentWorkspaces?.length && (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {recentWorkspaces?.map((workspace) => (
              <Link
                key={workspace.rowId}
                to="/workspaces/$workspaceSlug/projects"
                params={{ workspaceSlug: workspace.slug }}
                variant="ghost"
                className="h-fit overflow-hidden p-0 transition-transform hover:scale-[1.02] hover:bg-transparent"
              >
                <CardRoot className="w-full rounded-xl">
                  <CardHeader className="items-center">
                    <Avatar
                      src={undefined}
                      alt={workspace?.name}
                      fallback={
                        <div className="flex size-full items-center justify-center font-semibold">
                          {workspace?.name?.charAt(0).toUpperCase()}
                        </div>
                      }
                      size="lg"
                    />
                    <div className="flex flex-1 flex-col items-center">
                      <h3 className="truncate font-semibold text-base-900 dark:text-base-100">
                        {workspace?.name}
                      </h3>
                      <p className="mt-1 text-base-600 text-sm dark:text-base-400">
                        {workspace?.workspaceUsers?.totalCount} members
                      </p>
                    </div>
                  </CardHeader>
                </CardRoot>
              </Link>
            ))}

            {recentWorkspaces.length % 2 === 1 && (
              <CardRoot
                className="flex w-full cursor-pointer items-center justify-center rounded-xl border-dashed transition-transform hover:scale-[1.02]"
                onClick={() => setIsCreateWorkspaceOpen(true)}
              >
                <CardHeader className="flex-row items-center">
                  <PlusIcon className="size-4" />
                  Create New Workspace
                </CardHeader>
              </CardRoot>
            )}
          </div>
        )}

        {recentWorkspaces?.length! % 2 === 0 && (
          <div className="flex justify-center">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => setIsCreateWorkspaceOpen(true)}
            >
              <PlusIcon className="size-4" />
              Create New Workspace
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
