import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import workspaceOptions from "@/lib/options/workspace.options";
import { Role } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const routeApi = getRouteApi(
  "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/settings",
);

export default function ProjectDangerZone() {
  const { session } = routeApi.useRouteContext();
  const { workspaceId } = routeApi.useLoaderData();

  const { data: workspace } = useSuspenseQuery({
    ...workspaceOptions({ rowId: workspaceId, userId: session?.user?.rowId! }),
    select: (data) => data.workspace,
  });

  // Get role from IDP organization claims
  const role = useCurrentUserRole(workspace?.organizationId);
  const isOwner = role === Role.Owner;

  const { setIsOpen: setIsDeleteProjectOpen } = useDialogStore({
    type: DialogType.DeleteProject,
  });

  return (
    <div
      className={cn("ml-2 hidden flex-col gap-4 lg:ml-0", isOwner && "flex")}
    >
      <div className="flex flex-col gap-4">
        <h3 className="font-medium text-sm">Danger Zone</h3>

        <Button
          variant="destructive"
          className="w-fit"
          onClick={() => setIsDeleteProjectOpen(true)}
        >
          Delete Project
        </Button>
      </div>
    </div>
  );
}
