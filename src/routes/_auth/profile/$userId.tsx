import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { DestructiveActionDialog } from "@/components/core";
import {
  CustomizationTab,
  ProfileHeader,
  WorkspacesTable,
} from "@/components/profile";
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useDeleteWorkspaceMutation } from "@/generated/graphql";
import { BASE_URL } from "@/lib/config/env.config";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import workspacesOptions from "@/lib/options/workspaces.options";
import createMetaTags from "@/lib/util/createMetaTags";
import { useOrganization } from "@/providers/OrganizationProvider";
import { revokeSubscription } from "@/server/functions/subscriptions";

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
    { rowId: string; organizationId: string } | undefined
  >(undefined);

  const { session } = Route.useRouteContext();
  const orgContext = useOrganization();

  const isOmniMember =
    session?.organizations?.some((org) => org.slug === "omni") ?? false;

  const { setIsOpen: setIsDeleteWorkspaceOpen } = useDialogStore({
    type: DialogType.DeleteWorkspace,
  });

  const { data: workspaces } = useSuspenseQuery({
    ...workspacesOptions(),
    select: (data) => data.workspaces?.nodes,
  });

  const { mutate: deleteWorkspace } = useDeleteWorkspaceMutation({
    meta: {
      invalidates: [workspacesOptions().queryKey],
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

                  {/* Invitations are now managed via Gatekeeper (IDP) */}
                  {/* Users accept/reject invitations through the IDP UI or email links */}
                </div>
              </TabsContent>

              <TabsContent value="customization">
                <CustomizationTab />
              </TabsContent>
            </TabsRoot>
          </div>
        </div>
      </div>

      {!!workspaceToDelete &&
        (() => {
          const orgName = orgContext?.getOrganizationById(
            workspaceToDelete.organizationId,
          )?.name;
          return (
            <DestructiveActionDialog
              title="Danger Zone"
              description={
                <span>
                  This will delete{" "}
                  <strong className="font-medium text-base-900 dark:text-base-100">
                    {orgName}
                  </strong>{" "}
                  and all associated data. Any subscription associated with this
                  workspace will be revoked. This action cannot be undone.
                </span>
              }
              onConfirm={() => {
                handleDeleteWorkspace({
                  workspaceId: workspaceToDelete.rowId,
                });
              }}
              dialogType={DialogType.DeleteWorkspace}
              confirmation={`permanently delete ${orgName}`}
              onExitComplete={() => setWorkspaceToDelete(undefined)}
            />
          );
        })()}
    </div>
  );
}
