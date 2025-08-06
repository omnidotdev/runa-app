import { useAsyncQueuer } from "@tanstack/react-pacer/async-queuer";
import { useRateLimiter } from "@tanstack/react-pacer/rate-limiter";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { zodValidator } from "@tanstack/zod-adapter";
import { PlusIcon } from "lucide-react";
import ms from "ms";
import { useRef, useState } from "react";
import { Resend } from "resend";
import * as z from "zod/v4";

import WorkspaceInvitation from "@/components/emails/WorkspaceInvitation";
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
import { useCreateInvitationMutation } from "@/generated/graphql";
import { BASE_URL, isDevEnv } from "@/lib/config/env.config";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useForm from "@/lib/hooks/useForm";
import userOptions from "@/lib/options/user.options";
import workspaceOptions from "@/lib/options/workspace.options";

const MAX_NUMBER_OF_INVITES = 10;

const resend = new Resend(process.env.RESEND_API_KEY);

const inviteSchema = z.object({
  inviterEmail: z.email(),
  inviterUsername: z.string(),
  recipientEmail: z.email(),
  workspaceName: z.string(),
});

const sendInviteEmail = createServerFn({ method: "POST", response: "raw" })
  .validator(zodValidator(inviteSchema))
  .handler(async ({ data }) => {
    const { inviterEmail, inviterUsername, recipientEmail, workspaceName } =
      data;

    const { data: email, error } = await resend.emails.send({
      from: `Runa Support <${isDevEnv ? "onboarding@resend.dev" : inviterEmail}>`,
      to: isDevEnv ? "delivered@resend.dev" : recipientEmail,
      subject: `You have been invited to join the ${workspaceName} workspace on Runa`,
      react: WorkspaceInvitation({
        inviterUsername,
        inviterEmail,
        workspaceName,
        recipientEmail,
        inviteUrl: BASE_URL,
      }),
    });

    if (error) throw new Error(error.message);

    return Response.json({ email });
  });

const InviteMemberDialog = () => {
  const { workspaceId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/settings",
  });
  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/settings",
  });

  const {
    isOpen: isInviteTeamMemberOpen,
    setIsOpen: setIsInviteTeamMemberOpen,
  } = useDialogStore({
    type: DialogType.InviteTeamMember,
  });

  const { data: currentWorkspace } = useSuspenseQuery({
    ...workspaceOptions({ rowId: workspaceId, userId: session?.user?.rowId! }),
    select: (data) => data?.workspace,
  });

  const { data: user } = useQuery({
    ...userOptions({ userId: session?.user?.rowId! }),
    select: (data) => data?.user,
  });

  const [numberOfToasts, setNumberOfToasts] = useState(0);
  const emailRef = useRef<HTMLInputElement>(null);

  const rateLimiter = useRateLimiter(setNumberOfToasts, {
    limit: 2,
    window: ms("1s"),
  });

  const { mutateAsync: inviteMember } = useCreateInvitationMutation({
    onSuccess: async (_data, variables) => {
      await sendInviteEmail({
        data: {
          inviterEmail: user?.email!,
          inviterUsername: user?.name!,
          recipientEmail: variables.input.invitation.email,
          workspaceName: currentWorkspace?.name!,
        },
      });
    },
  });

  const queuer = useAsyncQueuer(
    async (recipientEmail: string) => {
      await inviteMember({
        input: {
          invitation: {
            email: recipientEmail,
            workspaceId,
          },
        },
      });
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
      onOpenChange={({ open }) => setIsInviteTeamMemberOpen(open)}
      // TODO: this isnt working.
      initialFocusEl={() => emailRef.current}
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Invite a new team member for the{" "}
            <strong className="text-primary">{currentWorkspace?.name}</strong>{" "}
            workspace.
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
                        <div className="mt-2 grid rounded-md border">
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
                          <TagsInputInput placeholder="hello@omni.dev" />
                        </div>
                        <TagsInputClearTrigger />
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
                >
                  Cancel
                </Button>
              </DialogCloseTrigger>

              <form.Subscribe
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
