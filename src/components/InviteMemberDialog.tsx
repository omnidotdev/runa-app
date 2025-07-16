import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { zodValidator } from "@tanstack/zod-adapter";
import { PlusIcon } from "lucide-react";
import { useRef } from "react";
import { Resend } from "resend";
import * as z from "zod/v4";

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
import { useCreateInvitationMutation } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useForm from "@/lib/hooks/useForm";
import workspaceOptions from "@/lib/options/workspace.options";
import WorkspaceInvitation from "./emails/WorkspaceInvitation";
import { Input } from "./ui/input";

const resend = new Resend(process.env.RESEND_API_KEY);

const inviteSchema = z.object({
  inviterEmail: z.email(),
  inviterUsername: z.string(),
  recipientEmail: z.email(),
  workspaceName: z.string(),
});

const sendInvite = createServerFn({ method: "POST", response: "raw" })
  .validator(zodValidator(inviteSchema))
  .handler(async ({ data }) => {
    const { inviterEmail, inviterUsername, recipientEmail, workspaceName } =
      data;

    const { data: email, error } = await resend.emails.send({
      // TODO: dynamic for dev v prod
      from: "Runa Support <onboarding@resend.dev>",
      // TODO: user recipientEmail in prod
      to: "delivered@resend.dev",
      subject: `You have been invited to join the ${workspaceName} workspace on Runa`,
      react: WorkspaceInvitation({
        inviterUsername,
        inviterEmail,
        workspaceName,
        recipientEmail,
        // TODO: dynamic for dev v prod
        inviteUrl: "https://localhost:3000",
      }),
    });

    if (error) throw new Error(error.message);

    return Response.json({ email });
  });

// TODO: Hook up member invite with BA to replace this temporary component.
const InviteMemberDialog = () => {
  const { workspaceId } = useParams({
    from: "/_auth/workspaces/$workspaceId/settings",
  });
  const nameRef = useRef<HTMLInputElement>(null);

  const { isOpen: isCreateMemberOpen, setIsOpen: setIsCreateMemberOpen } =
    useDialogStore({
      type: DialogType.CreateMember,
    });

  const { data: currentWorkspace } = useSuspenseQuery({
    ...workspaceOptions({ rowId: workspaceId }),
    select: (data) => data?.workspace,
  });

  const { mutate: inviteMember } = useCreateInvitationMutation({
    onSuccess: async (_data, variables) => {
      await sendInvite({
        data: {
          // TODO: dynamic with auth based query
          inviterEmail: "hello@omni.dev",
          // TODO: dynamic with auth based query
          inviterUsername: "omnitest",
          recipientEmail: variables.input.invitation.email,
          workspaceName: currentWorkspace?.name!,
        },
      });
    },
  });

  const form = useForm({
    defaultValues: {
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
      setIsCreateMemberOpen(false);
    },
  });

  return (
    <DialogRoot
      open={isCreateMemberOpen}
      onOpenChange={({ open }) => setIsCreateMemberOpen(open)}
      initialFocusEl={() => nameRef.current}
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogTitle>Add new member</DialogTitle>
          <DialogDescription>
            Create a new team member for the{" "}
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
            <form.Field name="recipientEmail">
              {(field) => (
                <Input
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
                    setIsCreateMemberOpen(false);
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
