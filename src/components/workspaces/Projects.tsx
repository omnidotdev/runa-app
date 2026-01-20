import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useNavigate, useParams } from "@tanstack/react-router";
import {
  MoreHorizontalIcon,
  Plus,
  Settings2Icon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";

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
} from "@/generated/graphql";
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
    from: "/_auth/workspaces/$workspaceSlug/settings",
  });

  const { organizationId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/settings",
  });

  const [selectedProject, setSelectedProject] = useState<{
    rowId: string;
    name: string;
  }>();

  const navigate = useNavigate();
  const orgContext = useOrganization();

  // Fetch projects for this organization
  const { data: projects } = useSuspenseQuery({
    ...projectsOptions({ organizationId: organizationId! }),
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

  const { mutate: deleteProject } = useDeleteProjectMutation({
    meta: {
      invalidates: [getQueryKeyPrefix(useProjectsQuery)],
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
            positioning={{ placement: "left" }}
            tooltip="Create Project"
            shortcut="P"
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
        title="Danger Zone"
        description={`This will delete the project "${selectedProject?.name}" from ${orgName} workspace. This action cannot be undone.`}
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
