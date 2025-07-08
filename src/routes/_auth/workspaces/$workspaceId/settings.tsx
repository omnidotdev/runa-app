import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import ConfirmDialog from "@/components/ConfirmDialog";
import Link from "@/components/core/Link";
import NotFound from "@/components/layout/NotFound";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const { queryClient } = Route.useRouteContext();

  const [selectedMember, setSelectedMember] = useState<{
    name: string;
    avatarUrl?: string | null;
    rowId: string;
  }>();
  const [selectedProject, setSelectedProject] = useState<{
    rowId: string;
    name: string;
  }>();
  const [editWorkspace, setEditWorkspace] = useState(false);

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

  // TODO
  // const handleRemoveMember = (memberId: string) => {
  //   const updatedMembers = members.filter((member) => member.id !== memberId);
  //   setMembers(updatedMembers);
  // };

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

  const { mutate: updateProject } = useUpdateWorkspaceMutation({
    onSettled: () => {
      reset();
      setEditWorkspace(false);

      return queryClient.invalidateQueries();
    },
  });

  const { Field, Subscribe, handleSubmit, reset } = useForm({
    defaultValues: {
      name: workspace?.name || "",
    },
    onSubmit: ({ value }) => {
      updateProject({
        rowId: workspaceId,
        patch: {
          name: value.name,
        },
      });
    },
  });

  return (
    <div className="relative h-full p-6">
      <Link
        to="/workspaces/$workspaceId/projects"
        className="inset-0 flex w-fit justify-start"
        params={{ workspaceId: workspaceId }}
        variant="ghost"
      >
        <ArrowLeft />
        Projects Overview
      </Link>

      <div className="flex flex-col gap-6 p-8">
        <h1 className="text-2xl">Workspace Settings</h1>

        <div className="flex flex-col gap-3 rounded-lg">
          <div className="flex items-center justify-between">
            <h2 className="block font-medium text-base-700 text-sm dark:text-base-300">
              Workspace Details
            </h2>

            <Tooltip tooltip="Edit workspace details">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Edit workspace details"
                onClick={() => setEditWorkspace((prev) => !prev)}
              >
                <Edit />
              </Button>
            </Tooltip>
          </div>

          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }}
          >
            <Field name="name">
              {(field) => (
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block font-medium text-base-700 text-sm dark:text-base-300"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Runa"
                    className="disabled:opacity-100"
                    disabled={!editWorkspace}
                  />
                </div>
              )}
            </Field>

            {editWorkspace && (
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditWorkspace(false)}
                >
                  Cancel
                </Button>

                <Subscribe
                  selector={(state) => [
                    state.canSubmit,
                    state.isSubmitting,
                    state.isDirty,
                  ]}
                >
                  {([canSubmit, isSubmitting, isDirty]) => (
                    <Button
                      type="submit"
                      disabled={!canSubmit || isSubmitting || !isDirty}
                    >
                      Save Changes
                    </Button>
                  )}
                </Subscribe>
              </div>
            )}
          </form>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-medium text-sm">Team Members</h3>

            <Tooltip tooltip="Add team member">
              <Button
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
            <div className="grid gap-2">
              {members.map((member) => (
                <div
                  key={member?.user?.rowId}
                  className="flex items-center justify-between rounded-lg border bg-accent p-3"
                >
                  <div className="flex items-center gap-3 ">
                    <Avatar
                      fallback={member?.user?.name?.charAt(0)}
                      src={member?.user?.avatarUrl!}
                      alt={member?.user?.name}
                      className="size-8 rounded-full border-2 bg-base-200 font-medium text-base-900 text-xs dark:bg-base-600 dark:text-base-100"
                    />

                    <span className="text-foreground text-sm">
                      {member?.user?.name}
                    </span>
                  </div>

                  <Tooltip tooltip="Remove team member">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Remove team member"
                      onClick={() => {
                        setIsDeleteTeamMemberOpen(true);
                        setSelectedMember(member?.user!);
                      }}
                      className="p-1 text-base-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <Trash2 />
                    </Button>
                  </Tooltip>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-medium text-sm">Projects</h3>

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
            <div className="grid gap-2">
              {workspace?.projects.nodes.map((project) => (
                <div
                  key={project?.rowId}
                  className="flex items-center justify-between rounded-lg border bg-accent p-3"
                >
                  <div className="flex items-center gap-3">
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

                  <Tooltip tooltip="Delete project">
                    <Button
                      variant="ghost"
                      aria-label="Delete project"
                      size="icon"
                      onClick={() => {
                        setIsDeleteProjectOpen(true);
                        setSelectedProject({
                          rowId: project?.rowId!,
                          name: project?.name!,
                        });
                      }}
                      className="p-1 text-base-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 rounded-lg border p-4 shadow-sm">
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

      {/* Delete Workspace */}
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

      {/* Delete Team Member */}
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

      {/* Delete Project */}
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

      {/* TODO: update to `InviteMember` and connect with email invitations */}
      {/* <CreateMemberDialog
        members={members}
        setMembers={setMembers}
      /> */}
    </div>
  );
}
