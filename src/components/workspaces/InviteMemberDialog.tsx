import { useAsyncQueuer } from "@tanstack/react-pacer/async-queuer";
import { useRateLimiter } from "@tanstack/react-pacer/rate-limiter";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import ms from "ms";
import { useRef, useState } from "react";
import { toast } from "sonner";

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
  TagsInputClearTrigger,
  TagsInputContext,
  TagsInputControl,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDeleteTrigger,
  TagsInputItemInput,
  TagsInputItemPreview,
  TagsInputItemText,
  TagsInputLabel,
  TagsInputRoot,
} from "@/components/ui/tags-input";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useForm from "@/lib/hooks/useForm";
import { useInviteMember } from "@/lib/hooks/useOrganizationMembers";
import organizationMembersOptions from "@/lib/options/organizationMembers.options";
import { Tier, getTierFromSubscription } from "@/lib/types/tier";
import { useOrganization } from "@/providers/OrganizationProvider";
import { inviteSchema } from "@/server/functions/emails";

import type { RefObject } from "react";

const MAX_NUMBER_OF_INVITES = 10;

interface Props {
  triggerRef?: RefObject<HTMLButtonElement | null>;
}

const InviteMemberDialog = ({ triggerRef }: Props) => {
  const { organizationId, subscription, prices } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/settings",
  });
  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/settings",
  });
  const orgContext = useOrganization();

  const {
    isOpen: isInviteTeamMemberOpen,
    setIsOpen: setIsInviteTeamMemberOpen,
  } = useDialogStore({
    type: DialogType.InviteTeamMember,
  });

  // Resolve org name from JWT claims
  const orgName = organizationId
    ? orgContext?.getOrganizationById(organizationId)?.name
    : undefined;

  // Fetch current members to check limits
  const { data: membersData } = useQuery({
    ...organizationMembersOptions({
      organizationId: organizationId!,
      accessToken: session?.accessToken!,
    }),
  });

  const memberCount = membersData?.members?.length ?? 0;

  // Derive tier from subscription
  const tier = getTierFromSubscription(
    subscription,
    prices,
    subscription?.priceId,
  );
  const maxMembers =
    tier === Tier.Team || tier === Tier.Enterprise
      ? Infinity
      : tier === Tier.Basic
        ? 10
        : 3;
  const canInviteMore = memberCount < maxMembers;

  const [numberOfToasts, setNumberOfToasts] = useState(0);
  const emailRef = useRef<HTMLInputElement>(null);

  const rateLimiter = useRateLimiter(setNumberOfToasts, {
    limit: 2,
    window: ms("1s"),
  });

  const { mutateAsync: inviteMemberMutation } = useInviteMember();

  const queuer = useAsyncQueuer(
    async (recipientEmail: string) => {
      try {
        await inviteMemberMutation({
          organizationId: organizationId!,
          email: recipientEmail,
          role: "member",
          accessToken: session?.accessToken!,
        });
        toast.success("Invitation sent");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to send invitation",
        );
        throw error;
      }
    },
    {
      concurrency: 2,
      wait: ms("1s"),
      maxSize: MAX_NUMBER_OF_INVITES,
      started: false,
    },
  );

  const form = useForm({
    defaultValues: {
      recipientEmail: [] as string[],
    },
    onSubmit: async ({ value, formApi }) => {
      value.recipientEmail.forEach((email) => queuer.addItem(email));

      queuer.start();

      formApi.reset();
      setIsInviteTeamMemberOpen(false);
    },
  });

  return (
    <DialogRoot
      open={isInviteTeamMemberOpen}
      onOpenChange={({ open }) => {
        setIsInviteTeamMemberOpen(open);
        form.reset();
      }}
      initialFocusEl={() => emailRef.current}
      finalFocusEl={triggerRef ? () => triggerRef.current : undefined}
      trapFocus
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Invite a new team member for the{" "}
            <strong className="text-primary">{orgName}</strong> workspace.
          </DialogDescription>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-2"
          >
            <form.Field name="recipientEmail" mode="array">
              {(field) => (
                <TagsInputRoot
                  addOnPaste
                  delimiter=","
                  max={MAX_NUMBER_OF_INVITES}
                  validate={(details) => {
                    const emails = details.inputValue.split(",");

                    // fail if more than max number of invites
                    if (emails.length > MAX_NUMBER_OF_INVITES) {
                      rateLimiter.maybeExecute(numberOfToasts + 1);

                      if (rateLimiter.getRemainingInWindow()) {
                        // TODO: toasts
                        alert("max number of invites reached");
                      }

                      return false;
                    }

                    // fail if email that is currently being pasted or added is a duplicate
                    if (emails.some((email) => details.value.includes(email))) {
                      rateLimiter.maybeExecute(numberOfToasts + 1);

                      if (rateLimiter.getRemainingInWindow()) {
                        // TODO: toasts
                        alert("This is a duplicate invite");
                      }

                      return false;
                    }

                    return emails.every((email) =>
                      inviteSchema.shape.recipientEmail.safeParse(email),
                    );
                  }}
                  value={field.state.value}
                  onValueChange={({ value }) => field.handleChange(value)}
                >
                  <TagsInputContext>
                    {({ value }) => (
                      <>
                        <TagsInputLabel>Email(s)</TagsInputLabel>
                        <div className="mt-2 grid rounded-md border focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
                          {!!value.length && (
                            <TagsInputControl>
                              {value.map((value, index) => (
                                <TagsInputItem
                                  key={value}
                                  index={index}
                                  value={value}
                                >
                                  <TagsInputItemPreview>
                                    <TagsInputItemText>
                                      {value}
                                    </TagsInputItemText>
                                    <TagsInputItemDeleteTrigger />
                                  </TagsInputItemPreview>
                                  <TagsInputItemInput />
                                </TagsInputItem>
                              ))}
                            </TagsInputControl>
                          )}
                          <TagsInputInput
                            ref={emailRef}
                            placeholder="hello@omni.dev"
                          />
                        </div>
                        <TagsInputClearTrigger tabIndex={0} />
                      </>
                    )}
                  </TagsInputContext>
                </TagsInputRoot>
              )}
            </form.Field>

            <div className="mt-4 flex justify-end gap-2">
              <DialogCloseTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setIsInviteTeamMemberOpen(false);
                  }}
                  tabIndex={0}
                >
                  Cancel
                </Button>
              </DialogCloseTrigger>

              <form.Subscribe
                selector={(state) => [
                  state.canSubmit,
                  state.isSubmitting,
                  state.isDefaultValue,
                ]}
              >
                {([canSubmit, isSubmitting, isDefaultValue]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting || isDefaultValue}
                    tabIndex={0}
                  >
                    <PlusIcon />
                    Invite Member
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default InviteMemberDialog;
