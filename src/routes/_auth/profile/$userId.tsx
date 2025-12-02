import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Building2, LogOut, Settings } from "lucide-react";
import { useState } from "react";

import DestructiveActionDialog from "@/components/core/DestructiveActionDialog";
import Link from "@/components/core/Link";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "@/generated/graphql";
import { signOut } from "@/lib/auth/signOut";
import { BASE_URL } from "@/lib/config/env.config";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import invitationsOptions from "@/lib/options/invitations.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import firstLetterToUppercase from "@/lib/util/firstLetterToUppercase";
import seo from "@/lib/util/seo";

import type { Workspace } from "@/generated/graphql";

export const Route = createFileRoute("/_auth/profile/$userId")({
  head: (context) => ({
    meta: [
      ...seo({
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
  const { mutateAsync: deleteInvation } = useDeleteInvitationMutation({
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

  return (
    <div className="no-scrollbar min-h-dvh overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <div className="mb-8 flex flex-col items-center gap-6 rounded-2xl p-6">
              <AvatarRoot className="size-28 ring-4 ring-primary/10">
                <AvatarImage
                  src={session?.user.image ?? undefined}
                  alt={session?.user.username}
                />
                <AvatarFallback className="font-semibold text-2xl">
                  {session?.user.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </AvatarRoot>
              <div className="text-center">
                <h2 className="font-bold text-xl tracking-tight">
                  {session?.user.name}
                </h2>
                <p className="mt-1 text-muted-foreground text-sm">
                  {session?.user.email}
                </p>
                <Button
                  variant="destructive"
                  className="mt-4"
                  onClick={signOut}
                  aria-label="Sign out"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </Button>
              </div>
            </div>
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
                    {workspaces?.length ? (
                      <Table containerProps="rounded-md border">
                        <TableHeader>
                          <TableRow className="bg-muted hover:bg-muted">
                            <TableHead className="pl-3 font-semibold">
                              Workspace
                            </TableHead>
                            <TableHead className="font-semibold">
                              Role
                            </TableHead>
                            <TableHead className="pr-3 text-right font-semibold">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {workspaces.map((workspace) => (
                            <TableRow
                              key={workspace.rowId}
                              className="hover:bg-background"
                            >
                              <TableCell className="py-4 pl-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                                    <Building2 className="size-4 text-primary" />
                                  </div>
                                  <span className="font-medium">
                                    {workspace.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="py-4 pl-1">
                                <Badge>
                                  {firstLetterToUppercase(
                                    workspace.currentUser.nodes[0].role,
                                  )}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-4 pr-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <Link
                                    to="/workspaces/$workspaceSlug/settings"
                                    params={{ workspaceSlug: workspace.slug }}
                                    variant="outline"
                                    size="sm"
                                    className="hover:border-green-200 hover:bg-green-50 hover:text-green-700 dark:hover:border-green-800 dark:hover:bg-green-950 dark:hover:text-green-300"
                                  >
                                    Settings
                                  </Link>
                                  {workspace.currentUser.nodes[0].role ===
                                  Role.Owner ? (
                                    <div className="justify-center">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:hover:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-300"
                                        onClick={() => {
                                          // TODO: figure out coercion issues here. This is way too verbose and at the end of the day, unsafe. We should not have to define fragments for every use case where we need to set an explicit type
                                          setWorkspaceToDelete(
                                            workspace as unknown as Partial<Workspace>,
                                          );
                                          setIsDeleteWorkspaceOpen(true);
                                        }}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="justify-center">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:hover:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-300"
                                        // TODO: add leave workspace functionality
                                        disabled
                                      >
                                        Leave
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <p>
                          No current workspaces. Create a workspace to get
                          started.
                        </p>
                        <Button className="w-fit">Create Workspace</Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-bold text-lg">Workspace Invitations</h2>
                    {invitations.length ? (
                      <Table containerProps="rounded-md border">
                        <TableHeader>
                          <TableRow className="bg-muted hover:bg-muted">
                            <TableHead className="pl-3 font-semibold">
                              Workspace
                            </TableHead>
                            <TableHead className="font-semibold">
                              Members
                            </TableHead>
                            <TableHead className="pr-3 text-right font-semibold">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invitations.map((invitation) => (
                            <TableRow
                              key={invitation.rowId}
                              className="hover:bg-background"
                            >
                              <TableCell className="py-4 pl-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                                    <Building2 className="size-4 text-primary" />
                                  </div>
                                  <span className="font-medium">
                                    {invitation.workspace?.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="py-4 pl-1">
                                <span className="text-muted-foreground text-sm">
                                  {invitation.workspace?.workspaceUsers
                                    .totalCount ?? 0}{" "}
                                  member
                                  {invitation.workspace?.workspaceUsers
                                    .totalCount === 1
                                    ? ""
                                    : "s"}
                                </span>
                              </TableCell>
                              <TableCell className="py-4 pr-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="hover:border-green-200 hover:bg-green-50 hover:text-green-700 dark:hover:border-green-800 dark:hover:bg-green-950 dark:hover:text-green-300"
                                    onClick={async () => {
                                      await Promise.all([
                                        acceptInvitation({
                                          input: {
                                            workspaceUser: {
                                              userId: session?.user.rowId!,
                                              workspaceId:
                                                invitation.workspace?.rowId!,
                                            },
                                          },
                                        }),
                                        invitation.workspace?.projects.nodes.map(
                                          (project) =>
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

                                      await deleteInvation({
                                        rowId: invitation.rowId,
                                      });
                                    }}
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:hover:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-300"
                                    onClick={async () =>
                                      await deleteInvation({
                                        rowId: invitation.rowId,
                                      })
                                    }
                                  >
                                    Reject
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      "No current invitations"
                    )}
                  </div>

                  <div className="mt-8 rounded-xl border border-destructive/20 bg-destructive/5 p-6">
                    <div className="flex flex-col gap-4">
                      <h3 className="font-bold text-destructive text-xl">
                        Danger Zone
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Permanently delete all of your associated data
                      </p>
                    </div>

                    <DialogRoot>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="mt-4 text-background"
                          // TODO: determine proper disabled state
                          disabled
                        >
                          Delete Account
                        </Button>
                      </DialogTrigger>
                      <DialogBackdrop />
                      <DialogPositioner>
                        <DialogContent className="w-full max-w-md rounded-lg bg-background">
                          <DialogCloseTrigger />

                          <div className="mb-1 flex flex-col gap-4">
                            <div className="flex size-10 items-center justify-center rounded-full border border-destructive bg-destructive/10">
                              <AlertTriangle className="size-5 text-destructive" />
                            </div>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                              This will permanently cancel your subscription and
                              delete all associated data. This action cannot be
                              undone.
                            </DialogDescription>
                          </div>

                          <div className="mt-4 flex justify-end gap-2">
                            <DialogCloseTrigger asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogCloseTrigger>

                            <DialogCloseTrigger asChild>
                              <Button
                                type="submit"
                                variant="destructive"
                                // TODO: enable
                                disabled
                              >
                                Delete Account
                              </Button>
                            </DialogCloseTrigger>
                          </div>
                        </DialogContent>
                      </DialogPositioner>
                    </DialogRoot>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="customization">
                <Card className="mt-4 border">
                  <CardHeader className="px-6 pt-6">
                    <CardTitle className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                        <Settings className="size-4" />
                      </div>
                      Customization Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <div className="p-8 text-center">
                      <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-muted/50">
                        <Settings className="size-8 text-muted-foreground" />
                      </div>
                      <h3 className="mb-3 font-bold text-xl">Coming Soon</h3>
                      <p className="mx-auto max-w-md text-muted-foreground text-sm leading-relaxed">
                        Customization options will be available in a future
                        update. You'll be able to personalize your workspaces,
                        themes, and preferences.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </TabsRoot>
          </div>
        </div>
      </div>
      {workspaceToDelete && (
        <DestructiveActionDialog
          title="Danger Zone"
          description={
            <span>
              This will delete{" "}
              <strong className="font-medium text-base-900 dark:text-base-100">
                {workspaceToDelete?.name}
              </strong>{" "}
              and all associated data. This action cannot be undone.
            </span>
          }
          onConfirm={() => {
            deleteWorkspace({
              rowId: workspaceToDelete?.rowId!,
            });
          }}
          dialogType={DialogType.DeleteWorkspace}
          confirmation={`Permanently delete ${workspaceToDelete?.name}`}
        />
      )}
    </div>
  );
}
