import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { DestructiveActionDialog } from "@/components/core";
import {
  CustomizationTab,
  DangerZone,
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
  useCreateUserPreferenceMutation,
  useCreateWorkspaceUserMutation,
  useDeleteInvitationMutation,
  useDeleteWorkspaceMutation,
} from "@/generated/graphql";
import { BASE_URL } from "@/lib/config/env.config";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import invitationsOptions from "@/lib/options/invitations.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import createMetaTags from "@/lib/util/createMetaTags";
import { revokeSubscription } from "@/server/functions/subscriptions";

import type { Maybe, Workspace } from "@/generated/graphql";

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
      invalidates: [["all"]],
    },
  });
  const { mutateAsync: acceptInvitation } = useCreateWorkspaceUserMutation();
  const { mutate: deleteWorkspace } = useDeleteWorkspaceMutation({
    meta: {
      invalidates: [
        workspacesOptions({ userId: session?.user.rowId! }).queryKey,
      ],
    },
    onSettled: () => setIsDeleteWorkspaceOpen(false),
  });

  const { mutateAsync: handleDeleteWorkspace } = useMutation({
    // TODO: make transactional
    mutationFn: async ({
      workspaceId,
      subscriptionId,
    }: {
      workspaceId: string;
      subscriptionId: Maybe<string> | undefined;
    }) => {
      // cancel subscription if it exists
      if (subscriptionId) {
        const revokedSubscriptionId = await revokeSubscription({
          data: { subscriptionId },
        });

        if (!revokedSubscriptionId)
          throw new Error("Issue revoking subscription");
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
    await Promise.all([
      acceptInvitation({
        input: {
          workspaceUser: {
            userId: session?.user.rowId!,
            workspaceId: invitation.workspace?.rowId!,
          },
        },
      }),
      invitation.workspace?.projects.nodes.map((project) =>
        createUserPreferences({
          input: {
            userPreference: {
              userId: session?.user.rowId!,
              projectId: project.rowId,
            },
          },
        }),
      ),
    ]);

    await deleteInvitation({ rowId: invitation.rowId });
  };

  const handleRejectInvitation = async (invitation: { rowId: string }) => {
    await deleteInvitation({ rowId: invitation.rowId });
  };

  return (
    <div className="no-scrollbar min-h-dvh overflow-y-auto bg-linear-to-br from-background via-background to-muted/20 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <ProfileHeader session={session} />
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

                  <DangerZone />
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
              subscriptionId: workspaceToDelete.subscriptionId,
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
