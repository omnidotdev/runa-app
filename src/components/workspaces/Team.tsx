import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import {
  CheckIcon,
  ChevronDownIcon,
  MoreHorizontalIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { match } from "ts-pattern";

import { DestructiveActionDialog, Tooltip } from "@/components/core";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { isSelfHosted } from "@/lib/config/env.config";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import {
  canModifyMember,
  useCanManageTeam,
} from "@/lib/hooks/useCanManageTeam";
import {
  useCancelInvitation,
  useRemoveMember,
  useUpdateMemberRole,
} from "@/lib/hooks/useOrganizationMembers";
import organizationInvitationsOptions from "@/lib/options/organizationInvitations.options";
import organizationMembersOptions from "@/lib/options/organizationMembers.options";
import { Tier, getTierFromSubscription } from "@/lib/types/tier";
import { cn } from "@/lib/utils";
import { useOrganization } from "@/providers/OrganizationProvider";
import InviteMemberDialog from "./InviteMemberDialog";

import type { Role } from "@/lib/permissions";

const Team = () => {
  const inviteRef = useRef<HTMLButtonElement>(null);

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

  // Resolve org name from JWT claims
  const orgName = organizationId
    ? orgContext?.getOrganizationById(organizationId)?.name
    : undefined;

  // Fetch members from Gatekeeper (IDP is source of truth)
  const { data: membersData } = useQuery({
    ...organizationMembersOptions({
      organizationId: organizationId!,
      accessToken: session?.accessToken!,
    }),
    enabled: !!organizationId && !!session?.accessToken,
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
  const { data: pendingInvitations = [] } = useQuery({
    ...organizationInvitationsOptions({
      organizationId: organizationId!,
    }),
    enabled: !!organizationId && canInvite,
  });

  const [selectedInvitation, setSelectedInvitation] = useState<{
    id: string;
    email: string;
  }>();

  const { mutate: removeMember } = useRemoveMember();
  const { mutate: updateMemberRole } = useUpdateMemberRole();
  const { mutate: cancelInvitation } = useCancelInvitation();

  const { setIsOpen: setIsDeleteTeamMemberOpen } = useDialogStore({
      type: DialogType.DeleteTeamMember,
    }),
    { setIsOpen: setIsInviteTeamMemberOpen } = useDialogStore({
      type: DialogType.InviteTeamMember,
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

  const _maxNumberOfMembersReached = isSelfHosted
    ? false
    : match(tier)
        .with(Tier.Team, Tier.Enterprise, () => members.length >= 50)
        .with(Tier.Pro, () => members.length >= 20)
        .otherwise(() => members.length >= 5);

  const maxNumberofAdminsReached = isSelfHosted
    ? false
    : match(tier)
        .with(Tier.Team, Tier.Enterprise, () => false)
        .with(
          Tier.Pro,
          () =>
            members.filter((member) => member.role !== "member").length >= 5,
        )
        .otherwise(
          () =>
            members.filter((member) => member.role !== "member").length >= 1,
        );

  return (
    <>
      <div className="flex flex-col">
        <div className="mb-1 flex h-10 items-center justify-between">
          <h2 className="ml-2 flex items-center gap-2 font-medium text-base-700 text-sm lg:ml-0 dark:text-base-300">
            Team Members
          </h2>

          <Tooltip
            positioning={{ placement: "left" }}
            tooltip={
              _maxNumberOfMembersReached
                ? "Upgrade to invite more members"
                : "Invite Member"
            }
            trigger={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Invite team member"
                className={cn(
                  "mr-2 hidden size-7 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent",
                  canInvite && "inline-flex",
                )}
                onClick={() => setIsInviteTeamMemberOpen(true)}
                disabled={_maxNumberOfMembersReached}
                ref={inviteRef}
              >
                <PlusIcon />
              </Button>
            }
          />
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
            No team members
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

          {pendingInvitations.length ? (
            <div className="flex flex-col divide-y border-y">
              {pendingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="group flex h-10 w-full items-center px-2 hover:bg-accent lg:px-0"
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

                    <Badge variant="outline">
                      <p className="first-letter:uppercase">
                        {invitation.role ?? "member"}
                      </p>
                    </Badge>

                    <div className="mr-2 ml-auto flex gap-1">
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
              ))}
            </div>
          ) : (
            <div className="ml-2 flex items-center text-base-500 text-sm lg:ml-0">
              No pending invitations
            </div>
          )}
        </div>
      )}

      <DestructiveActionDialog
        title="Danger Zone"
        description={`This will remove ${selectedMember?.name} from ${orgName} organization. This action cannot be undone.`}
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

      <InviteMemberDialog triggerRef={inviteRef} />
    </>
  );
};

export default Team;
