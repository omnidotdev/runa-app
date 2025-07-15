import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  BoxIcon,
  Plus,
  PlusIcon,
  Settings2Icon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
import { useDeleteProjectMutation } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import workspaceOptions from "@/lib/options/workspace.options";
import { cn } from "@/lib/utils";
import ConfirmDialog from "../ConfirmDialog";
import { SidebarMenuShotcut } from "../ui/sidebar";

const Projects = () => {
  const { workspaceId } = useParams({
    from: "/_auth/workspaces/$workspaceId/settings",
  });

  const [selectedProject, setSelectedProject] = useState<{
    rowId: string;
    name: string;
  }>();

  const navigate = useNavigate();

  const { data: workspace } = useSuspenseQuery({
    ...workspaceOptions({ rowId: workspaceId }),
    select: (data) => data?.workspace,
  });

  const { mutate: deleteProject } = useDeleteProjectMutation({
    meta: {
      invalidates: [
        ["Projects"],
        workspaceOptions({ rowId: workspaceId }).queryKey,
      ],
    },
  });

  const { setIsOpen: setIsCreateProjectOpen } = useDialogStore({
      type: DialogType.CreateProject,
    }),
    { setIsOpen: setIsDeleteProjectOpen } = useDialogStore({
      type: DialogType.DeleteProject,
    }),
    { setIsOpen: setIsCreateTaskDialogOpen } = useDialogStore({
      type: DialogType.CreateTask,
    });

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 font-medium text-base-700 text-sm dark:text-base-300">
            Projects
          </h2>

          <Tooltip
            tooltip={{
              className: "bg-background text-foreground border",
              children: (
                <div className="inline-flex">
                  Create Project
                  <div className="ml-2 flex items-center gap-0.5">
                    <SidebarMenuShotcut>P</SidebarMenuShotcut>
                  </div>
                </div>
              ),
            }}
          >
            <Button
              variant="ghost"
              size="icon"
              aria-label="Add project"
              onClick={() => setIsCreateProjectOpen(true)}
            >
              <Plus size={12} />
            </Button>
          </Tooltip>
        </div>

        {!!workspace?.projects.nodes.length && (
          <div className="flex-1 rounded-md border">
            <Table>
              <TableBody>
                {workspace?.projects.nodes.map((project) => {
                  const completedTasks = project.columns?.nodes?.reduce(
                    (acc, col) => acc + (col?.completedTasks.totalCount || 0),
                    0,
                  );
                  const totalTasks = project.columns?.nodes?.reduce(
                    (acc, col) => acc + (col?.allTasks.totalCount || 0),
                    0,
                  );

                  return (
                    <TableRow key={project?.rowId}>
                      <TableCell className="flex items-center gap-3 p-1">
                        <div className="ml-1 flex items-center gap-3">
                          <div
                            className={cn(
                              "flex size-8 items-center justify-center rounded-full border bg-background font-medium text-sm uppercase shadow",
                              project?.color && "text-background",
                            )}
                            style={{
                              backgroundColor: project?.color ?? undefined,
                            }}
                          >
                            {project?.name[0]}
                          </div>

                          <span className="text-sm">{project?.name}</span>
                        </div>

                        <div className="mr-1 ml-auto flex gap-1">
                          <div className="hidden gap-1 lg:flex">
                            <div className="flex h-7 items-center px-4">
                              <span className="text-base-600 text-xs dark:text-base-400">
                                {completedTasks}/{totalTasks} tasks
                              </span>
                            </div>

                            <Tooltip tooltip="View project">
                              <Link
                                to="/workspaces/$workspaceId/projects/$projectId"
                                params={{
                                  workspaceId: workspaceId,
                                  projectId: project.rowId,
                                }}
                                className={buttonVariants({
                                  variant: "ghost",
                                  size: "icon",
                                  className: "h-7 w-7 p-1 text-base-400",
                                })}
                              >
                                <BoxIcon className="size-4" />
                              </Link>
                            </Tooltip>

                            <Tooltip tooltip="Project settings">
                              <Link
                                to="/workspaces/$workspaceId/projects/$projectId/settings"
                                params={{
                                  workspaceId: workspaceId,
                                  projectId: project.rowId,
                                }}
                                className={buttonVariants({
                                  variant: "ghost",
                                  size: "icon",
                                  className: "h-7 w-7 p-1 text-base-400",
                                })}
                              >
                                <Settings2Icon className="size-4" />
                              </Link>
                            </Tooltip>

                            <Tooltip tooltip="Add task">
                              <Button
                                variant="ghost"
                                size="xs"
                                className="h-7 w-7 p-1 text-base-400"
                                onClick={() => {
                                  navigate({
                                    to: "/workspaces/$workspaceId/projects/$projectId",
                                    params: {
                                      workspaceId: workspaceId,
                                      projectId: project.rowId,
                                    },
                                  });
                                  setIsCreateTaskDialogOpen(true);
                                }}
                              >
                                <PlusIcon className="size-4" />
                              </Button>
                            </Tooltip>
                          </div>

                          <Button
                            variant="ghost"
                            aria-label="Delete project"
                            size="icon"
                            onClick={() => {
                              setIsDeleteProjectOpen(true);
                              setSelectedProject({
                                rowId: project.rowId,
                                name: project.name,
                              });
                            }}
                            className="h-7 w-7 p-1 text-base-400 hover:text-red-500 dark:hover:text-red-400"
                          >
                            <Trash2Icon className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <ConfirmDialog
        title="Danger Zone"
        description={`This will delete the project "${selectedProject?.name}" from ${workspace?.name} workspace. This action cannot be undone.`}
        onConfirm={() => {
          deleteProject({ rowId: selectedProject?.rowId! });
        }}
        dialogType={DialogType.DeleteProject}
        confirmation={`permanently delete ${selectedProject?.name}`}
        inputProps={{
          className: "focus-visible:ring-red-500",
        }}
      />
    </>
  );
};

export default Projects;
