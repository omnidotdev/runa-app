import { useSuspenseQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useRouteContext,
} from "@tanstack/react-router";
import {
  BoxIcon,
  MoreHorizontalIcon,
  Plus,
  PlusIcon,
  Settings2Icon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";

import DestructiveActionDialog from "@/components/core/DestructiveActionDialog";
import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { Tooltip } from "@/components/ui/tooltip";
import { Role, useDeleteProjectMutation } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useMaxProjectsReached from "@/lib/hooks/useMaxProjectsReached";
import useMaxTasksReached from "@/lib/hooks/useMaxTasksReached";
import workspaceOptions from "@/lib/options/workspace.options";
import { cn } from "@/lib/utils";

const Projects = () => {
  const { workspaceSlug } = useParams({
    from: "/_auth/workspaces/$workspaceSlug/settings",
  });

  const { workspaceId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/settings",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/settings",
  });

  const [selectedProject, setSelectedProject] = useState<{
    rowId: string;
    name: string;
  }>();

  const navigate = useNavigate();

  const { data: workspace } = useSuspenseQuery({
    ...workspaceOptions({
      rowId: workspaceId,
      userId: session?.user?.rowId!,
    }),
    select: (data) => data?.workspace,
  });

  const isMember = workspace?.workspaceUsers?.nodes?.[0]?.role === Role.Member;

  const maxProjectsReached = useMaxProjectsReached();
  const maxTasksReached = useMaxTasksReached();

  const { mutate: deleteProject } = useDeleteProjectMutation({
    meta: {
      invalidates: [
        ["Projects"],
        workspaceOptions({
          rowId: workspaceId,
          userId: session?.user?.rowId!,
        }).queryKey,
      ],
    },
  });

  const { setIsOpen: setIsCreateProjectOpen } = useDialogStore({
      type: DialogType.CreateProject,
    }),
    { setIsOpen: setIsDeleteProjectOpen } = useDialogStore({
      type: DialogType.DeleteProject,
    });

  return (
    <>
      <div className="flex flex-col">
        <div className="mb-1 flex h-10 items-center justify-between">
          <h2 className="ml-2 flex items-center gap-2 font-medium text-base-700 text-sm lg:ml-0 dark:text-base-300">
            Projects
          </h2>

          <Tooltip
            positioning={{
              placement: "top-end",
            }}
            tooltip="Create Project"
            shortcut="P"
          >
            <Button
              variant="ghost"
              size="icon"
              aria-label="Add project"
              className={cn("mr-2 hidden size-7", !isMember && "inline-flex")}
              onClick={() => setIsCreateProjectOpen(true)}
              // TODO: add tooltip for disabled state
              disabled={maxProjectsReached}
            >
              <Plus />
            </Button>
          </Tooltip>
        </div>

        {workspace?.projects.nodes.length ? (
          <div className="flex flex-col divide-y border-y px-2 lg:px-0">
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
                <div
                  key={project?.rowId}
                  className="group flex h-10 w-full items-center hover:bg-accent"
                >
                  <div className="flex items-center">
                    <div className="flex size-10 items-center justify-center">
                      <div
                        className={cn(
                          "flex size-6 items-center justify-center rounded-full border bg-background font-medium text-sm uppercase shadow",
                          project?.userPreferences.nodes?.[0]?.color &&
                            "text-background",
                        )}
                        style={{
                          backgroundColor:
                            project?.userPreferences.nodes?.[0]?.color ??
                            undefined,
                        }}
                      >
                        {project?.name[0]}
                      </div>
                    </div>

                    <span className="px-3 text-xs md:text-sm">
                      {project?.name}
                    </span>

                    <span className="text-base-600 text-sm dark:text-base-400">
                      {project.projectColumn?.emoji}
                    </span>
                  </div>

                  <div className="mr-2 ml-auto flex gap-1">
                    <span className="flex items-center px-3 text-base-500 text-xs dark:text-base-400">
                      {completedTasks}/{totalTasks} tasks
                    </span>

                    <MenuRoot
                      positioning={{
                        strategy: "fixed",
                        placement: "left-start",
                      }}
                    >
                      <MenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-base-400"
                          aria-label="More project options"
                        >
                          <MoreHorizontalIcon />
                        </Button>
                      </MenuTrigger>

                      <MenuPositioner>
                        <MenuContent className="min-w-40 focus-within:outline-none">
                          <MenuItem
                            value="view project"
                            onClick={() => {
                              navigate({
                                to: "/workspaces/$workspaceSlug/projects/$projectSlug",
                                params: {
                                  workspaceSlug,
                                  projectSlug: project.slug,
                                },
                              });
                            }}
                          >
                            <BoxIcon />
                            <span> View Project </span>
                          </MenuItem>

                          <MenuItem
                            value="project settings"
                            onClick={() => {
                              navigate({
                                to: "/workspaces/$workspaceSlug/projects/$projectSlug/settings",
                                params: {
                                  workspaceSlug,
                                  projectSlug: project.slug,
                                },
                              });
                            }}
                          >
                            <Settings2Icon />
                            <span> Project Settings </span>
                          </MenuItem>

                          <MenuItem
                            value="add task"
                            // TODO: add tooltip description for disabled state
                            disabled={maxTasksReached}
                            onClick={() => {
                              navigate({
                                to: "/workspaces/$workspaceSlug/projects/$projectSlug",
                                params: {
                                  workspaceSlug,
                                  projectSlug: project.slug,
                                },
                                search: {
                                  createTask: true,
                                },
                              });
                            }}
                          >
                            <PlusIcon />
                            <span> Add Task </span>
                          </MenuItem>

                          <MenuItem
                            value="delete"
                            variant="destructive"
                            className={cn("hidden", !isMember && "flex")}
                            onClick={() => {
                              setIsDeleteProjectOpen(true);
                              setSelectedProject({
                                rowId: project.rowId,
                                name: project.name,
                              });
                            }}
                          >
                            <Trash2Icon />
                            <span> Delete </span>
                          </MenuItem>
                        </MenuContent>
                      </MenuPositioner>
                    </MenuRoot>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="ml-2 flex items-center text-base-500 text-sm lg:ml-0">
            {!workspace?.projectColumns.nodes.length
              ? "Please create workspace columns first"
              : "No workspace projects"}
          </div>
        )}
      </div>

      <DestructiveActionDialog
        title="Danger Zone"
        description={`This will delete the project "${selectedProject?.name}" from ${workspace?.name} workspace. This action cannot be undone.`}
        onConfirm={() => {
          deleteProject({ rowId: selectedProject?.rowId! });
        }}
        dialogType={DialogType.DeleteProject}
        confirmation={`permanently delete ${selectedProject?.name}`}
      />
    </>
  );
};

export default Projects;
