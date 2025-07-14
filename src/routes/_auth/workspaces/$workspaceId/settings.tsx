import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  FolderOpenIcon,
  Plus,
  Trash2,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

import ConfirmDialog from "@/components/ConfirmDialog";
import Link from "@/components/core/Link";
import RichTextEditor from "@/components/core/RichTextEditor";
import NotFound from "@/components/layout/NotFound";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
import {
  useDeleteProjectMutation,
  useDeleteWorkspaceMutation,
  useDeleteWorkspaceUserMutation,
  useUpdateWorkspaceMutation,
} from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import workspaceOptions from "@/lib/options/workspace.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import workspaceUsersOptions from "@/lib/options/workspaceUsers.options";
import seo from "@/lib/util/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute({
  loader: async ({ params: { workspaceId }, context: { queryClient } }) => {
    const { workspace } = await queryClient.ensureQueryData(
      workspaceOptions({ rowId: workspaceId }),
    );

    if (!workspace) {
      throw notFound();
    }

    return { name: workspace.name };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [...seo({ title: `${loaderData.name} Settings` })]
      : undefined,
  }),
  notFoundComponent: () => <NotFound>Workspace Not Found</NotFound>,
  component: SettingsPage,
});

function SettingsPage() {
  const { workspaceId } = Route.useParams();
  const navigate = Route.useNavigate();

  const [selectedMember, setSelectedMember] = useState<{
    name: string;
    avatarUrl?: string | null;
    rowId: string;
  }>();
  const [selectedProject, setSelectedProject] = useState<{
    rowId: string;
    name: string;
  }>();
  const [nameError, setNameError] = useState<string | null>(null);

  const { mutate: deleteMember } = useDeleteWorkspaceUserMutation({
    meta: {
      invalidates: [workspaceUsersOptions({ rowId: workspaceId }).queryKey],
    },
  });

  const { data: members } = useSuspenseQuery({
    ...workspaceUsersOptions({ rowId: workspaceId }),
    select: (data) => data?.workspaceUsers?.nodes,
  });

  const { data: workspace } = useSuspenseQuery({
    ...workspaceOptions({ rowId: workspaceId }),
    select: (data) => data?.workspace,
  });

  const { mutate: deleteWorkspace } = useDeleteWorkspaceMutation({
    meta: {
      invalidates: [workspacesOptions().queryKey],
    },
    onMutate: () => navigate({ to: "/workspaces", replace: true }),
    onSettled: () => setIsDeleteWorkspaceOpen(false),
  });

  const { mutate: deleteProject } = useDeleteProjectMutation({
    meta: {
      invalidates: [
        ["Projects"],
        workspaceOptions({ rowId: workspaceId }).queryKey,
      ],
    },
  });

  const { setIsOpen: setIsDeleteWorkspaceOpen } = useDialogStore({
      type: DialogType.DeleteWorkspace,
    }),
    { setIsOpen: setIsDeleteTeamMemberOpen } = useDialogStore({
      type: DialogType.DeleteTeamMember,
    }),
    { setIsOpen: setIsDeleteProjectOpen } = useDialogStore({
      type: DialogType.DeleteProject,
    }),
    { setIsOpen: setIsCreateMemberOpen } = useDialogStore({
      type: DialogType.CreateMember,
    }),
    { setIsOpen: setIsCreateProjectOpen } = useDialogStore({
      type: DialogType.CreateProject,
    });

  const { mutate: updateWorkspace } = useUpdateWorkspaceMutation({
    meta: {
      invalidates: [["all"]],
    },
  });

  const handleWorkspaceUpdate = useDebounceCallback(updateWorkspace, 300);

  return (
    <div className="no-scrollbar relative h-full overflow-auto p-12">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/workspaces/$workspaceId/projects"
            params={{ workspaceId: workspaceId }}
            variant="ghost"
            size="icon"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex flex-col gap-2">
            <RichTextEditor
              defaultContent={workspace?.name}
              className="min-h-0 border-0 bg-transparent p-0 text-2xl dark:bg-transparent"
              skeletonClassName="h-8 w-80"
              onUpdate={({ editor }) => {
                const text = editor.getText().trim();

                if (text.length < 3) {
                  setNameError("Workspace name must be at least 3 characters.");
                  return;
                }

                setNameError(null);
                handleWorkspaceUpdate({
                  rowId: workspaceId,
                  patch: {
                    name: text,
                  },
                });
              }}
            />

            {nameError && (
              <p className="mt-1 text-red-500 text-sm">{nameError}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 font-medium text-base-700 text-sm dark:text-base-300">
              <UsersIcon className="size-4" />
              Team Members
            </h2>

            <Tooltip tooltip="Add team member">
              <Button
                disabled
                variant="ghost"
                size="icon"
                aria-label="Add team member"
                onClick={() => setIsCreateMemberOpen(true)}
              >
                <Plus />
              </Button>
            </Tooltip>
          </div>

          {!!members?.length && (
            <div className="flex-1 rounded-md border">
              <Table>
                <TableBody>
                  {members?.map((member) => (
                    <TableRow key={member?.user?.rowId}>
                      <TableCell className="flex items-center gap-3 ">
                        <Avatar
                          fallback={member.user?.name?.charAt(0)}
                          src={member.user?.avatarUrl ?? undefined}
                          alt={member.user?.name}
                          className="size-8 rounded-full border-2 bg-base-200 font-medium text-base-900 text-xs dark:bg-base-600 dark:text-base-100"
                        />

                        <span className="text-foreground text-sm">
                          {member?.user?.name}
                        </span>

                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Remove team member"
                          onClick={() => {
                            setIsDeleteTeamMemberOpen(true);
                            setSelectedMember(member.user!);
                          }}
                          className="ml-auto p-1 text-base-400 hover:text-red-500 dark:hover:text-red-400"
                        >
                          <Trash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 font-medium text-base-700 text-sm dark:text-base-300">
              <FolderOpenIcon className="size-4" />
              Projects
            </h2>

            <Tooltip tooltip="Add project">
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
                  {workspace?.projects.nodes.map((project) => (
                    <TableRow key={project?.rowId}>
                      <TableCell className="flex items-center gap-3 ">
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

                          <span className="text-foreground text-sm">
                            {project?.name}
                          </span>
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
                          className="ml-auto p-1 text-base-400 hover:text-red-500 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-sm">Danger Zone</h3>

            <Button
              variant="destructive"
              className="w-fit text-background"
              onClick={() => setIsDeleteWorkspaceOpen(true)}
            >
              Delete Workspace
            </Button>
          </div>
        </div>
        <ConfirmDialog
          title="Danger Zone"
          description={`This will permanently delete ${workspace?.name} and all associated data. This action cannot be undone.`}
          onConfirm={() => {
            deleteWorkspace({ rowId: workspace?.rowId! });
          }}
          dialogType={DialogType.DeleteWorkspace}
          confirmation={`permanently delete ${workspace?.name}`}
          inputProps={{
            className: "focus-visible:ring-red-500",
          }}
        />

        <ConfirmDialog
          title="Danger Zone"
          description={`This will delete ${selectedMember?.name} from ${workspace?.name} workspace. This action cannot be undone.`}
          onConfirm={() =>
            deleteMember({ userId: selectedMember?.rowId!, workspaceId })
          }
          dialogType={DialogType.DeleteTeamMember}
          confirmation={selectedMember?.name}
          inputProps={{
            className: "focus-visible:ring-red-500",
          }}
        />
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
      </div>
    </div>
  );
}
