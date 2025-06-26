import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { FolderOpen, LogOut, Plus } from "lucide-react";

import CreateProjectDialog from "@/components/CreateProjectDialog";
import Link from "@/components/core/Link";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import WorkspaceSelector from "@/components/WorkspaceSelector";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import workspaceOptions from "@/lib/options/workspace.options";

const Sidebar = () => {
  const { workspaceId } = useParams({ strict: false });

  const { data: workspace } = useQuery({
    ...workspaceOptions(workspaceId!),
    enabled: !!workspaceId,
    select: (data) => data.workspace,
  });
  const navigate = useNavigate();

  const { setIsOpen: setIsCreateProjectOpen } = useDialogStore({
    type: DialogType.CreateProject,
  });

  return (
    <>
      <div className="grid h-full grid-rows-[auto_1fr_auto] border-r bg-background">
        <div className="flex items-center justify-between gap-2 border-b p-4">
          <WorkspaceSelector />

          <ThemeToggle />
        </div>

        <div className="flex flex-col overflow-hidden p-4">
          {workspaceId && (
            <>
              <Link
                to="/workspaces/$workspaceId/projects"
                params={{
                  workspaceId: workspaceId!,
                }}
                variant="ghost"
                activeOptions={{ exact: true }}
                activeProps={{
                  variant: "outline",
                }}
                className="w-full justify-start"
              >
                <div className="flex items-center gap-2">
                  <FolderOpen className="text-base-500" />
                  <span>Projects</span>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="ml-auto size-6"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsCreateProjectOpen(true);
                  }}
                >
                  <Plus className="text-base-500" />
                </Button>
              </Link>

              <div className="mt-2 flex h-full flex-col gap-1 overflow-y-auto">
                {workspace?.projects.nodes?.map((project) => (
                  <Link
                    key={project?.rowId}
                    to="/workspaces/$workspaceId/projects/$projectId"
                    params={{
                      workspaceId: workspaceId!,
                      projectId: project?.rowId!,
                    }}
                    variant="ghost"
                    size="sm"
                    activeProps={{
                      variant: "outline",
                    }}
                    className="justify-start"
                  >
                    <span className="truncate">{project?.name}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="grid items-end gap-2 border-t p-4">
          {workspaceId && (
            <Link
              to="/workspaces/$workspaceId/settings"
              params={{ workspaceId: workspaceId! }}
              variant="outline"
              className="w-full"
            >
              Workspace Settings
            </Link>
          )}

          <Button
            // TODO
            onClick={() => navigate({ to: "/" })}
            variant="outline"
            className="w-full text-red-600 dark:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <CreateProjectDialog />
    </>
  );
};

export default Sidebar;
