import { useQuery } from "@tanstack/react-query";
import { notFound, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import ConfirmDialog from "@/components/ConfirmDialog";
import CreateMemberDialog from "@/components/CreateMemberDialog";
import Link from "@/components/core/Link";
import NotFound from "@/components/layout/NotFound";
import { Button } from "@/components/ui/button";
import {
  useDeleteProjectMutation,
  useDeleteWorkspaceMutation,
} from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import projectsOptions from "@/lib/options/projects.options";
import workspaceOptions from "@/lib/options/workspace.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import getQueryClient from "@/utils/getQueryClient";
import seo from "@/utils/seo";

import type { Assignee } from "@/types";

export const Route = createFileRoute({
  ssr: false,
  loader: async ({ params: { workspaceId }, context }) => {
    const { workspace } = await context.queryClient.ensureQueryData(
      workspaceOptions(workspaceId),
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
  const { workspaceId } = useParams({ strict: false });
  const queryClient = getQueryClient();
  const navigate = useNavigate();

  // TODO: Replace with actual members fetching logic.
  const [members, setMembers] = useState<Assignee[]>([]);
  const [selectedMember, setSelectedMember] = useState<Assignee>();
  const [selectedProject, setSelectedProject] = useState<{
    rowId: string;
    name: string;
  }>();

  const { data: currentWorkspace } = useQuery({
    ...workspaceOptions(workspaceId!),
    enabled: !!workspaceId,
    select: (data) => data?.workspace,
  });

  const handleRemoveMember = (memberId: string) => {
    const updatedMembers = members.filter((member) => member.id !== memberId);
    setMembers(updatedMembers);
  };

  const { mutate: deleteWorkspace } = useDeleteWorkspaceMutation({
    onMutate: () => navigate({ to: "/workspaces", replace: true }),
    onSettled: () => {
      setIsDeleteWorkspaceOpen(false);
      queryClient.invalidateQueries(workspacesOptions);
    },
  });

  const { mutate: deleteProject } = useDeleteProjectMutation({
    onSettled: () => {
      queryClient.invalidateQueries(projectsOptions);
      queryClient.invalidateQueries(workspaceOptions(workspaceId!));
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

  return (
    <div className="relative h-full p-6">
      <Link
        to="/workspaces/$workspaceId"
        className="inset-0 flex w-fit justify-start"
        params={{ workspaceId: workspaceId! }}
        variant="ghost"
      >
        <ArrowLeft className="mr-1 size-4" />
        Back to Workspace
      </Link>

      <div className="flex flex-col gap-6 p-8">
        <h1 className="text-2xl">Workspace Settings</h1>

        <div className="flex flex-col gap-4 rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-medium text-sm">Team Members</h3>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCreateMemberOpen(true)}
            >
              <Plus size={12} />
            </Button>
          </div>

          {members.length > 0 && (
            <div className="grid gap-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border bg-accent p-3"
                >
                  <div className="flex items-center gap-3 ">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background font-medium text-sm uppercase shadow">
                      {member.name[0]}
                    </div>

                    <span className="text-foreground text-sm">
                      {member.name}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsDeleteTeamMemberOpen(true);
                      setSelectedMember(member);
                    }}
                    className="p-1 text-base-400 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-medium text-sm">Projects</h3>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCreateProjectOpen(true)}
            >
              <Plus size={12} />
            </Button>
          </div>

          {!!currentWorkspace?.projects.nodes.length && (
            <div className="grid gap-2">
              {currentWorkspace?.projects.nodes.map((project) => (
                <div
                  key={project?.rowId}
                  className="flex items-center justify-between rounded-lg border bg-accent p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background font-medium text-sm uppercase shadow">
                      {project?.name[0]}
                    </div>

                    <span className="text-foreground text-sm">
                      {project?.name}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
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
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 rounded-lg border p-4 shadow-sm">
          <h3 className="font-medium text-sm">Danger Zone</h3>

          <Button
            variant="destructive"
            className="w-fit"
            onClick={() => setIsDeleteWorkspaceOpen(true)}
          >
            Delete Workspace
          </Button>
        </div>
      </div>

      {/* Delete Workspace */}
      <ConfirmDialog
        title="Danger Zone"
        description={`This will permanently delete ${currentWorkspace?.name} and all associated data. This action cannot be undone.`}
        onConfirm={() => {
          deleteWorkspace({ rowId: currentWorkspace?.rowId! });
        }}
        dialogType={DialogType.DeleteWorkspace}
        confirmation={`permanently delete ${currentWorkspace?.name}`}
      />

      {/* Delete Team Member */}
      <ConfirmDialog
        title="Danger Zone"
        description={`This will delete ${selectedMember?.name} from ${currentWorkspace?.name} workspace. This action cannot be undone.`}
        onConfirm={() => {
          // TODO
          handleRemoveMember(selectedMember?.id!);
        }}
        dialogType={DialogType.DeleteTeamMember}
        confirmation={selectedMember?.name}
      />

      {/* Delete Project */}
      <ConfirmDialog
        title="Danger Zone"
        description={`This will delete the project "${selectedProject?.name}" from ${currentWorkspace?.name} workspace. This action cannot be undone.`}
        onConfirm={() => {
          deleteProject({ rowId: selectedProject?.rowId! });
        }}
        dialogType={DialogType.DeleteProject}
        confirmation={`permanently delete ${selectedProject?.name}`}
      />

      <CreateMemberDialog
        // TODO: Hook up to actual members data
        members={members}
        setMembers={setMembers}
      />
    </div>
  );
}
