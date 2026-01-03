import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { DestructiveActionDialog } from "@/components/core";
import {
  CustomizationTab,
  InvitationsTable,
  ProfileHeader,
  WorkspacesTable,
} from "@/components/profile";
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Role,
  useCreateUserPreferenceMutation,
  useCreateWorkspaceUserMutation,
  useDeleteInvitationMutation,
  useDeleteWorkspaceMutation,
  useInvitationsQuery,
  useWorkspaceBySlugQuery,
  useWorkspaceUsersQuery,
} from "@/generated/graphql";
import { BASE_URL } from "@/lib/config/env.config";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import invitationsOptions from "@/lib/options/invitations.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import createMetaTags from "@/lib/util/createMetaTags";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { revokeSubscription } from "@/server/functions/subscriptions";

import type { Workspace } from "@/generated/graphql";

export const Route = createFileRoute("/_auth/profile/$userId")({
  head: (context) => ({
    meta: [
      ...createMetaTags({
        title: "Profile",
        description: "User profile page.",
        url: `${BASE_URL}/profile/${context.params.userId}`,
      }),
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [workspaceToDelete, setWorkspaceToDelete] = useState<
    Partial<Workspace> | undefined
  >(undefined);

  const { session } = Route.useRouteContext();

  const isOmniMember =
    session?.organizations?.some((org) => org.slug === "omni") ?? false;

  const { setIsOpen: setIsDeleteWorkspaceOpen } = useDialogStore({
    type: DialogType.DeleteWorkspace,
  });

  const { data: invitations } = useSuspenseQuery({
    ...invitationsOptions({ email: session?.user.email! }),
    select: (data) => data?.invitations?.nodes ?? [],
  });

  const { data: workspaces } = useSuspenseQuery({
    ...workspacesOptions({ userId: session?.user.rowId! }),
    select: (data) => data.workspaces?.nodes,
  });

  const { mutateAsync: createUserPreferences } =
    useCreateUserPreferenceMutation();
  const { mutateAsync: deleteInvitation } = useDeleteInvitationMutation({
    meta: {
      invalidates: [getQueryKeyPrefix(useInvitationsQuery)],
    },
  });
  const { mutateAsync: acceptInvitation } = useCreateWorkspaceUserMutation({
    meta: {
      invalidates: [
        workspacesOptions({ userId: session?.user.rowId! }).queryKey,
        getQueryKeyPrefix(useWorkspaceBySlugQuery),
        getQueryKeyPrefix(useWorkspaceUsersQuery),
      ],
    },
  });
  const { mutate: deleteWorkspace } = useDeleteWorkspaceMutation({
    meta: {
      invalidates: [
        workspacesOptions({ userId: session?.user.rowId! }).queryKey,
      ],
    },
    onSettled: () => setIsDeleteWorkspaceOpen(false),
  });

  const { mutateAsync: handleDeleteWorkspace } = useMutation({
    mutationFn: async ({ workspaceId }: { workspaceId: string }) => {
      // Cancel any active subscription before deleting workspace
      try {
        await revokeSubscription({ data: { workspaceId } });
      } catch {
        // Subscription may not exist, continue with deletion
      }

      // delete workspace
      deleteWorkspace({ rowId: workspaceId });
    },
    onError: (err) => toast.error(err.message),
  });

  const handleAcceptInvitation = async (invitation: {
    rowId: string;
    workspace?: {
      rowId: string;
      projects: { nodes: Array<{ rowId: string }> };
    } | null;
  }) => {
    try {
      // First accept the invitation (creates workspace user)
      // The invitation must exist for authorization to pass
      await acceptInvitation({
        input: {
          workspaceUser: {
            userId: session?.user.rowId!,
            workspaceId: invitation.workspace?.rowId!,
            role: Role.Member,
          },
        },
      });

      // Create user preferences for all projects in the workspace
      if (invitation.workspace?.projects.nodes.length) {
        await Promise.all(
          invitation.workspace.projects.nodes.map((project) =>
            createUserPreferences({
              input: {
                userPreference: {
                  userId: session?.user.rowId!,
                  projectId: project.rowId,
                },
              },
            }),
          ),
        );
      }

      // Delete the invitation after successful acceptance
      await deleteInvitation({ rowId: invitation.rowId });

      toast.success("Successfully joined workspace");
    } catch (error) {
      toast.error("Failed to accept invitation");
      throw error;
    }
  };

  const handleRejectInvitation = async (invitation: { rowId: string }) => {
    await deleteInvitation({ rowId: invitation.rowId });
  };

  return (
    <div className="no-scrollbar min-h-dvh overflow-y-auto bg-linear-to-br from-background via-background to-muted/20 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <ProfileHeader session={session} isOmniTeamMember={isOmniMember} />
          </div>

          <div className="xl:col-span-8">
            <TabsRoot defaultValue="account">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="customization">Customization</TabsTrigger>
              </TabsList>

              <TabsContent value="account">
                <div className="mt-4 space-y-8">
                  <div className="space-y-4">
                    <h2 className="font-bold text-lg">Current Workspaces</h2>
                    <WorkspacesTable
                      workspaces={workspaces}
                      onDeleteWorkspace={(workspace) => {
                        setWorkspaceToDelete(workspace);
                        setIsDeleteWorkspaceOpen(true);
                      }}
                    />
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-bold text-lg">Workspace Invitations</h2>
                    <InvitationsTable
                      invitations={invitations}
                      onAccept={handleAcceptInvitation}
                      onReject={handleRejectInvitation}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="customization">
                <CustomizationTab />
              </TabsContent>
            </TabsRoot>
          </div>
        </div>
      </div>

      {!!workspaceToDelete && (
        <DestructiveActionDialog
          title="Danger Zone"
          description={
            <span>
              This will delete{" "}
              <strong className="font-medium text-base-900 dark:text-base-100">
                {workspaceToDelete?.name}
              </strong>{" "}
              and all associated data. Any subscription associated with this
              workspace will be revoked. This action cannot be undone.
            </span>
          }
          onConfirm={() => {
            handleDeleteWorkspace({
              workspaceId: workspaceToDelete.rowId!,
            });
          }}
          dialogType={DialogType.DeleteWorkspace}
          confirmation={`permanently delete ${workspaceToDelete?.name}`}
          onExitComplete={() => setWorkspaceToDelete(undefined)}
        />
      )}
    </div>
  );
}
