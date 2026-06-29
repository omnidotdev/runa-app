import { ManageTeamLink } from "@omnidotdev/providers/react";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@omnidotdev/thornberry/avatar";
import { Badge } from "@omnidotdev/thornberry/badge";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import {
  CheckIcon,
  ChevronDownIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RefreshCwIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DestructiveActionDialog, Tooltip } from "@/components/core";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { AUTH_BASE_URL, hasBilling } from "@/lib/config/env.config";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import {
  canModifyMember,
  useCanManageTeam,
} from "@/lib/hooks/useCanManageTeam";
import {
  useCancelInvitation,
  useRemoveMember,
  useResendInvitation,
  useUpdateMemberRole,
} from "@/lib/hooks/useOrganizationMembers";
import organizationInvitationsOptions from "@/lib/options/organizationInvitations.options";
import organizationMembersOptions from "@/lib/options/organizationMembers.options";
import { getMaxAdmins, getTierFromSubscription } from "@/lib/types/tier";
import { cn } from "@/lib/utils";
import { getInviteTimeInfo } from "@/lib/validation/invitation";
import { useOrganization } from "@/providers/OrganizationProvider";

import type { Role } from "@/lib/permissions";

const Team = () => {
  const { organizationId, subscription, prices } = useLoaderData({
    from: "/_app/workspaces/$workspaceSlug/settings",
  });

  const { session } = useRouteContext({
    from: "/_app/workspaces/$workspaceSlug/settings",
  });

  const [selectedMember, setSelectedMember] = useState<{
    name: string;
    avatarUrl?: string | null;
    id: string;
  }>();

  const orgContext = useOrganization();

  // Resolve org name + slug from JWT claims
  const org = organizationId
    ? orgContext?.getOrganizationById(organizationId)
    : undefined;
  const orgName = org?.name;
  const orgSlug = org?.slug;

  // Fetch members from Gatekeeper (IDP is source of truth)
  const { data: membersData } = useQuery({
    ...organizationMembersOptions({
      organizationId: organizationId!,
    }),
    enabled: !!organizationId,
  });

  const members = membersData?.data ?? [];

  // Find current user's role from Gatekeeper members
  const currentUserMember = members.find(
    (m) => m.user.id === session?.user?.identityProviderId,
  );
  const currentUserRole = currentUserMember?.role as Role | undefined;
  const { canInvite, canChangeRoles, canRemoveMembers } =
    useCanManageTeam(currentUserRole);

  // Fetch pending invitations (visible to admins+)
  const { data: invitationsData } = useQuery({
    ...organizationInvitationsOptions({
      organizationId: organizationId!,
    }),
    enabled: !!organizationId && canInvite,
  });

  const activeInvitations = invitationsData?.active ?? [];
  const expiredInvitations = invitationsData?.expired ?? [];

  const [selectedInvitation, setSelectedInvitation] = useState<{
    id: string;
    email: string;
  }>();

  const { mutate: removeMember } = useRemoveMember();
  const { mutate: updateMemberRole } = useUpdateMemberRole();
  const { mutate: cancelInvitation } = useCancelInvitation();
  const { mutate: resendInvitation, isPending: isResending } =
    useResendInvitation();

  const { setIsOpen: setIsDeleteTeamMemberOpen } = useDialogStore({
      type: DialogType.DeleteTeamMember,
    }),
    { isOpen: isCancelInvitationOpen, setIsOpen: setIsCancelInvitationOpen } =
      useDialogStore({
        type: DialogType.CancelInvitation,
      });

  // Derive tier from subscription
  const tier = getTierFromSubscription(
    subscription,
    prices,
    subscription?.priceId,
  );

  // Admin-promotion gating. Member counts mirror the omni-api catalog SSOT via
  // the centralized tier helpers; membership itself is managed at Gatekeeper.
  const maxAdmins = getMaxAdmins(tier);
  const adminCount = members.filter(
    (member) => member.role !== "member",
  ).length;
  const maxNumberofAdminsReached =
    hasBilling && Number.isFinite(maxAdmins) && adminCount >= maxAdmins;

  return (
    <>
      <div className="flex flex-col">
        <div className="mb-1 flex h-10 items-center justify-between">
          <h2 className="ml-2 flex items-center gap-2 font-medium text-base-700 text-sm lg:ml-0 dark:text-base-300">
            Team Members
          </h2>

          {/* Team membership is managed centrally at Gatekeeper (the shared
              IDP); invite/role/remove happen there, not re-implemented per app */}
          {canInvite && orgSlug && AUTH_BASE_URL && (
            <ManageTeamLink
              identityBaseUrl={AUTH_BASE_URL}
              orgSlug={orgSlug}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "mr-2 gap-1.5",
              )}
            >
              <PlusIcon className="size-4" />
              Manage team
            </ManageTeamLink>
          )}
        </div>

        {members.length ? (
          <div className="flex flex-col divide-y border-y">
            {members.map((member) => {
              // check if current user can modify this member
              const canModifyThisMember =
                currentUserRole &&
                member.role &&
                canModifyMember(currentUserRole, member.role as Role);

              // cannot modify self
              const isSelf =
                member.user.id === session?.user?.identityProviderId;

              return (
                <div
                  key={member.id}
                  className="group flex h-10 w-full items-center px-2 hover:bg-accent lg:px-0"
                >
                  <div className="flex w-full items-center">
                    <div className="flex size-10 items-center justify-center">
                      <AvatarRoot
                        size="xs"
                        className="size-6 rounded-full border bg-background font-medium text-sm uppercase shadow"
                      >
                        <AvatarImage
                          src={member.user.image ?? undefined}
                          alt={member.user.name}
                        />
                        <AvatarFallback>
                          {member.user.name?.charAt(0)}
                        </AvatarFallback>
                      </AvatarRoot>
                    </div>

                    <span className="px-3 text-xs md:text-sm">
                      {member.user.name}
                    </span>

                    <MenuRoot
                      positioning={{
                        strategy: "fixed",
                        placement: "bottom-start",
                      }}
                      onSelect={({ value }) =>
                        updateMemberRole({
                          organizationId: organizationId!,
                          memberId: member.id,
                          role: value as "owner" | "admin" | "member",
                          accessToken: session?.accessToken!,
                        })
                      }
                    >
                      <MenuTrigger
                        disabled={isSelf || !canModifyThisMember}
                        asChild
                      >
                        <Badge variant="outline">
                          <p className="first-letter:uppercase">
                            {member.role}
                          </p>
                          <ChevronDownIcon
                            className={cn(
                              "hidden",
                              canChangeRoles &&
                                !isSelf &&
                                canModifyThisMember &&
                                "inline-flex",
                            )}
                          />
                        </Badge>
                      </MenuTrigger>

                      <MenuPositioner>
                        <MenuContent>
                          <MenuItem
                            value="admin"
                            disabled={
                              member.role === "admin" ||
                              maxNumberofAdminsReached
                            }
                          >
                            Admin
                            {member.role === "admin" && (
                              <CheckIcon className="text-green-500" />
                            )}
                          </MenuItem>
                          <MenuItem
                            value="member"
                            disabled={member.role === "member"}
                            className="justify-between"
                          >
                            Member
                            {member.role === "member" && (
                              <CheckIcon className="text-green-500" />
                            )}
                          </MenuItem>
                        </MenuContent>
                      </MenuPositioner>
                    </MenuRoot>

                    <div className="mr-2 ml-auto flex gap-1">
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
                            className={cn(
                              "hidden size-7 text-base-400",
                              canRemoveMembers &&
                                canModifyThisMember &&
                                "inline-flex",
                            )}
                            aria-label="More team member options"
                          >
                            <MoreHorizontalIcon />
                          </Button>
                        </MenuTrigger>

                        <MenuPositioner>
                          <MenuContent className="focus-within:outline-none">
                            <MenuItem
                              value="delete"
                              variant="destructive"
                              onClick={() => {
                                setIsDeleteTeamMemberOpen(true);
                                setSelectedMember({
                                  name: member.user.name,
                                  avatarUrl: member.user.image,
                                  id: member.id,
                                });
                              }}
                              disabled={isSelf}
                            >
                              <Trash2Icon />
                              <span> Delete </span>
                            </MenuItem>
                          </MenuContent>
                        </MenuPositioner>
                      </MenuRoot>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="ml-2 flex items-center text-base-500 text-sm lg:ml-0">
            {canInvite && orgSlug && AUTH_BASE_URL ? (
              <ManageTeamLink
                identityBaseUrl={AUTH_BASE_URL}
                orgSlug={orgSlug}
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "h-auto p-0 text-sm",
                )}
              >
                Invite your first team member
              </ManageTeamLink>
            ) : (
              "No team members"
            )}
          </div>
        )}
      </div>

      {canInvite && (
        <div className="mt-8 flex flex-col">
          <div className="mb-1 flex h-10 items-center">
            <h2 className="ml-2 font-medium text-base-700 text-sm lg:ml-0 dark:text-base-300">
              Pending Invitations
            </h2>
          </div>

          {activeInvitations.length || expiredInvitations.length ? (
            <div className="flex flex-col divide-y border-y">
              {[...activeInvitations, ...expiredInvitations].map(
                (invitation) => {
                  const timeInfo = getInviteTimeInfo(invitation);

                  return (
                    <div
                      key={invitation.id}
                      className={cn(
                        "group flex h-10 w-full items-center px-2 hover:bg-accent lg:px-0",
                        timeInfo.isExpired && "opacity-60 hover:opacity-100",
                      )}
                    >
                      <div className="flex w-full items-center">
                        <div className="flex size-10 items-center justify-center">
                          <AvatarRoot
                            size="xs"
                            className="size-6 rounded-full border bg-background font-medium text-sm uppercase shadow"
                          >
                            <AvatarFallback>
                              {invitation.email.charAt(0)}
                            </AvatarFallback>
                          </AvatarRoot>
                        </div>

                        <span className="px-3 text-xs md:text-sm">
                          {invitation.email}
                        </span>

                        {timeInfo.isExpired ? (
                          <Badge
                            variant="outline"
                            className="border-destructive/40 text-destructive"
                          >
                            Expired
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <p className="first-letter:uppercase">
                              {invitation.role ?? "member"}
                            </p>
                          </Badge>
                        )}

                        <span className="ml-2 hidden text-base-400 text-xs group-hover:inline">
                          {timeInfo.expiresLabel}
                        </span>

                        <div className="mr-2 ml-auto flex gap-1">
                          <Tooltip
                            positioning={{ placement: "left" }}
                            tooltip="Resend invitation"
                            trigger={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 text-base-400 hover:text-primary"
                                aria-label={`Resend invitation to ${invitation.email}`}
                                disabled={isResending}
                                onClick={() =>
                                  resendInvitation(
                                    {
                                      organizationId: organizationId!,
                                      email: invitation.email,
                                      role:
                                        (invitation.role as
                                          | "admin"
                                          | "member"
                                          | null) ?? "member",
                                    },
                                    {
                                      onSuccess: () =>
                                        toast.success(
                                          `Invitation resent to ${invitation.email}`,
                                        ),
                                      onError: (error) =>
                                        toast.error(
                                          error instanceof Error
                                            ? error.message
                                            : "Failed to resend invitation",
                                        ),
                                    },
                                  )
                                }
                              >
                                <RefreshCwIcon className="size-4" />
                              </Button>
                            }
                          />

                          <Tooltip
                            positioning={{ placement: "left" }}
                            tooltip="Revoke invitation"
                            trigger={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 text-base-400 hover:text-destructive"
                                aria-label={`Revoke invitation for ${invitation.email}`}
                                onClick={() => {
                                  setSelectedInvitation({
                                    id: invitation.id,
                                    email: invitation.email,
                                  });
                                  setIsCancelInvitationOpen(true);
                                }}
                              >
                                <XIcon className="size-4" />
                              </Button>
                            }
                          />
                        </div>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          ) : (
            <div className="ml-2 flex items-center text-base-500 text-sm lg:ml-0">
              No pending invitations
            </div>
          )}
        </div>
      )}

      <DestructiveActionDialog
        title="Remove team member"
        description={
          <span>
            This will remove{" "}
            <strong className="font-medium text-base-900 dark:text-base-100">
              {selectedMember?.name}
            </strong>{" "}
            from the{" "}
            <strong className="font-medium text-base-900 dark:text-base-100">
              {orgName}
            </strong>{" "}
            organization. They will lose access to all projects.
          </span>
        }
        onConfirm={() =>
          removeMember({
            organizationId: organizationId!,
            memberId: selectedMember?.id!,
            accessToken: session?.accessToken!,
          })
        }
        dialogType={DialogType.DeleteTeamMember}
      />

      <DialogRoot
        open={isCancelInvitationOpen}
        onOpenChange={(details) => setIsCancelInvitationOpen(details.open)}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogCloseTrigger />
            <DialogTitle>Revoke Invitation</DialogTitle>
            <DialogDescription>
              This will revoke the invitation sent to{" "}
              <span className="font-medium">{selectedInvitation?.email}</span>.
              You can always send a new invitation later.
            </DialogDescription>

            <div className="flex justify-end gap-2 pt-2">
              <DialogCloseTrigger asChild>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </DialogCloseTrigger>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (!selectedInvitation) return;

                  cancelInvitation(
                    {
                      invitationId: selectedInvitation.id,
                      organizationId: organizationId!,
                    },
                    {
                      onSuccess: () => {
                        toast.success(
                          `Invitation to ${selectedInvitation.email} revoked`,
                        );
                        setIsCancelInvitationOpen(false);
                      },
                      onError: (error) => {
                        toast.error(
                          error instanceof Error
                            ? error.message
                            : "Failed to revoke invitation",
                        );
                      },
                    },
                  );
                }}
              >
                Revoke
              </Button>
            </div>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </>
  );
};

export default Team;
