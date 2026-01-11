import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";

import { DestructiveActionDialog } from "@/components/core";
import { Button } from "@/components/ui/button";
import { useDeleteWorkspaceMutation } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import workspaceOptions from "@/lib/options/workspace.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import { isOwner } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { revokeSubscription } from "@/server/functions/subscriptions";

const routeApi = getRouteApi("/_auth/workspaces/$workspaceSlug/settings");

export default function WorkspaceDangerZone() {
  const { session } = routeApi.useRouteContext();
  const { workspaceId } = routeApi.useLoaderData();
  const navigate = routeApi.useNavigate();

  const { data: workspace } = useSuspenseQuery({
    ...workspaceOptions({
      rowId: workspaceId,
      userId: session?.user?.rowId!,
    }),
    select: (data) => data?.workspace,
  });

  const currentUserRole = workspace?.workspaceUsers?.nodes?.[0]?.role;
  const canDeleteWorkspace = currentUserRole && isOwner(currentUserRole);

  const { setIsOpen: setIsDeleteWorkspaceOpen } = useDialogStore({
    type: DialogType.DeleteWorkspace,
  });

  const { mutate: deleteWorkspace } = useDeleteWorkspaceMutation({
    meta: {
      invalidates: [
        workspacesOptions({ userId: session?.user.rowId! }).queryKey,
      ],
    },
    onMutate: () => navigate({ to: "/workspaces", replace: true }),
    onSettled: () => setIsDeleteWorkspaceOpen(false),
  });

  return (
    <>
      <div
        className={cn(
          "ml-2 hidden flex-col gap-4 lg:ml-0",
          canDeleteWorkspace && "flex",
        )}
      >
        <h3 className="font-medium text-sm">Danger Zone</h3>

        <Button
          variant="destructive"
          className="w-fit text-background"
          onClick={() => setIsDeleteWorkspaceOpen(true)}
        >
          Delete Workspace
        </Button>
      </div>

      <DestructiveActionDialog
        title="Danger Zone"
        description={
          <span>
            This will delete{" "}
            <strong className="font-medium text-base-900 dark:text-base-100">
              {workspace?.name}
            </strong>{" "}
            and all associated data. Any subscription associated with this
            workspace will be revoked. This action cannot be undone.
          </span>
        }
        onConfirm={async () => {
          // Cancel any active subscription before deleting workspace
          try {
            await revokeSubscription({
              data: { workspaceId: workspace?.rowId },
            });
          } catch {
            // Subscription may not exist, continue with deletion
          }

          deleteWorkspace({ rowId: workspace?.rowId! });
          navigate({ to: "/workspaces", replace: true });
        }}
        dialogType={DialogType.DeleteWorkspace}
        confirmation={`permanently delete ${workspace?.name}`}
      />
    </>
  );
}
