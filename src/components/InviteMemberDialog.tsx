import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { zodValidator } from "@tanstack/zod-adapter";
import { PlusIcon } from "lucide-react";
import { useRef } from "react";
import { Resend } from "resend";
import * as z from "zod";

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
import { Input } from "@/components/ui/input";
import { useCreateInvitationMutation } from "@/generated/graphql";
import { BASE_URL, isDevEnv } from "@/lib/config/env.config";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useForm from "@/lib/hooks/useForm";
import userOptions from "@/lib/options/user.options";
import workspaceOptions from "@/lib/options/workspace.options";

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
  const emailRef = useRef<HTMLInputElement>(null);

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

  // TODO: tanstack pacer integration once bulk invites are set up with tags input
  const { mutate: inviteMember } = useCreateInvitationMutation({
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

  const form = useForm({
    defaultValues: {
      // TODO: update to an array when a tags input component is introduced
      recipientEmail: "",
    },
    onSubmit: async ({ value, formApi }) => {
      inviteMember({
        input: {
          invitation: {
            workspaceId,
            email: value.recipientEmail,
          },
        },
      });

      formApi.reset();
      setIsInviteTeamMemberOpen(false);
    },
  });

  return (
    <DialogRoot
      open={isInviteTeamMemberOpen}
      onOpenChange={({ open }) => setIsInviteTeamMemberOpen(open)}
      initialFocusEl={() => emailRef.current}
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
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
          >
            {/* TODO: update to use `mode="array"` and use a tags input component for bulk invites */}
            <form.Field name="recipientEmail">
              {(field) => (
                <Input
                  ref={emailRef}
                  placeholder="hello@omni.dev"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            </form.Field>

            <div className="mt-4 flex justify-end gap-2">
              <DialogCloseTrigger asChild>
                <Button
                  variant="ghost"
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
