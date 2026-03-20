import { useSuspenseQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useRouteContext,
} from "@tanstack/react-router";
import {
  MoreHorizontalIcon,
  Plus,
  Settings2Icon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DestructiveActionDialog, Tooltip } from "@/components/core";
import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  useDeleteProjectMutation,
  useProjectsQuery,
  useProjectsSidebarQuery,
} from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import useMaxProjectsReached from "@/lib/hooks/useMaxProjectsReached";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import projectsOptions from "@/lib/options/projects.options";
import { isAdminOrOwner } from "@/lib/permissions";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { cn } from "@/lib/utils";
import { useOrganization } from "@/providers/OrganizationProvider";

const Projects = () => {
  const { workspaceSlug } = useParams({
    from: "/_app/workspaces/$workspaceSlug/settings",
  });

  const { organizationId } = useLoaderData({
    from: "/_app/workspaces/$workspaceSlug/settings",
  });

  const { session } = useRouteContext({
    from: "/_app/workspaces/$workspaceSlug/settings",
  });

  const [selectedProject, setSelectedProject] = useState<{
    rowId: string;
    name: string;
  }>();

  const navigate = useNavigate();
  const orgContext = useOrganization();

  // Fetch projects for this organization
  const { data: projects } = useSuspenseQuery({
    ...projectsOptions({
      organizationId: organizationId!,
      userId: session?.user?.rowId,
    }),
    select: (data) =>
      [...(data?.projects?.nodes ?? [])].sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
  });

  // Fetch project columns for this organization
  const { data: projectColumns } = useSuspenseQuery({
    ...projectColumnsOptions({ organizationId: organizationId! }),
    select: (data) => data?.projectColumns?.nodes ?? [],
  });

  // Resolve org name from JWT claims
  const orgName = organizationId
    ? orgContext?.getOrganizationById(organizationId)?.name
    : undefined;

  // Get role from IDP organization claims
  const currentUserRole = useCurrentUserRole(organizationId);
  const canManageProjects = currentUserRole && isAdminOrOwner(currentUserRole);

  const maxProjectsReached = useMaxProjectsReached();

  const { mutateAsync: deleteProject } = useDeleteProjectMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useProjectsQuery),
        getQueryKeyPrefix(useProjectsSidebarQuery),
      ],
    },
  });

  const { setIsOpen: setIsCreateProjectOpen } = useDialogStore({
      type: DialogType.CreateProject,
    }),
    { setIsOpen: setIsDeleteProjectOpen } = useDialogStore({
      type: DialogType.DeleteProject,
    });

  const handleDeleteProject = () => {
    // TODO: Incorporate a toast action that allows users to undo the deletion.
    toast.promise(deleteProject({ rowId: selectedProject?.rowId! }), {
      loading: "Deleting project...",
      success: "Project deleted successfully!",
      error: "Failed to delete project. Please try again.",
    });
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="mb-1 flex h-10 items-center justify-between">
          <h2 className="ml-2 flex items-center gap-2 font-medium text-base-700 text-sm lg:ml-0 dark:text-base-300">
            Projects
          </h2>

          <Tooltip
            positioning={{ placement: "left" }}
            tooltip="Create Project"
            shortcut={Hotkeys.CreateProject.toUpperCase()}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Add project"
                className={cn(
                  "mr-2 hidden size-7",
                  canManageProjects && "inline-flex",
                )}
                onClick={() => setIsCreateProjectOpen(true)}
                // TODO: add tooltip for disabled state
                disabled={maxProjectsReached}
              >
                <Plus />
              </Button>
            }
          />
        </div>

        {projects.length ? (
          <div className="flex flex-col divide-y border-y">
            {projects.map((project) => {
              const completedTasks = project.completedTasks?.totalCount ?? 0;
              const totalTasks = project.allTasks?.totalCount ?? 0;

              return (
                <div
                  key={project?.rowId}
                  className="group flex h-10 w-full cursor-pointer items-center hover:bg-accent"
                  onClick={() =>
                    navigate({
                      to: "/workspaces/$workspaceSlug/projects/$projectSlug",
                      params: {
                        workspaceSlug,
                        projectSlug: project.slug,
                      },
                    })
                  }
                >
                  <div className="flex items-center">
                    <div className="flex size-10 items-center justify-center">
                      <div
                        className="flex size-6 items-center justify-center rounded-full border bg-primary font-medium text-background text-sm uppercase shadow"
                        style={{
                          backgroundColor: project?.color ?? undefined,
                        }}
                      >
                        {project?.name[0]}
                      </div>
                    </div>

                    <span className="px-3 text-xs md:text-sm">
                      {project?.name}
                    </span>
                  </div>

                  <div className="mr-2 ml-auto flex gap-1">
                    <span className="flex items-center px-3 text-base-500 text-xs dark:text-base-400">
                      {completedTasks}/{totalTasks} tasks
                    </span>

                    <MenuRoot
                      positioning={{
                        strategy: "fixed",
                        placement: "left",
                      }}
                    >
                      <MenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-base-400"
                          aria-label="More project options"
                          onClick={(evt) => evt.stopPropagation()}
                        >
                          <MoreHorizontalIcon />
                        </Button>
                      </MenuTrigger>

                      <MenuPositioner>
                        <MenuContent className="focus-within:outline-none">
                          <MenuItem
                            value="settings"
                            onClick={(evt) => {
                              evt.stopPropagation();
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
                            <span>Settings</span>
                          </MenuItem>

                          <MenuItem
                            value="delete"
                            variant="destructive"
                            className={cn(
                              "hidden",
                              canManageProjects && "flex",
                            )}
                            onClick={(evt) => {
                              evt.stopPropagation();
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
            {!projectColumns.length
              ? "Please create workspace columns first"
              : "No workspace projects"}
          </div>
        )}
      </div>

      <DestructiveActionDialog
        title="Delete project"
        description={
          <span>
            This will permanently delete the{" "}
            <strong className="font-medium text-base-900 dark:text-base-100">
              {selectedProject?.name}
            </strong>{" "}
            project, including all tasks, labels, and member assignments. This
            action cannot be undone.
          </span>
        }
        onConfirm={handleDeleteProject}
        dialogType={DialogType.DeleteProject}
        confirmation={selectedProject?.name}
      />
    </>
  );
};

export default Projects;
