import { useStore } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { ChevronDownIcon, PlusIcon } from "lucide-react";
import { useRef } from "react";

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
  createListCollection,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemText,
  SelectTrigger,
} from "@/components/ui/select";
import { useCreateWorkspaceUserMutation } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useForm from "@/lib/hooks/useForm";
import usersOptions from "@/lib/options/users.options";
import workspaceOptions from "@/lib/options/workspace.options";
import workspaceUsersOptions from "@/lib/options/workspaceUsers.options";
import { cn } from "@/lib/utils";

const CreateMemberDialog = () => {
  const { workspaceId } = useParams({ strict: false });
  const nameRef = useRef<HTMLInputElement>(null);

  const { isOpen: isCreateMemberOpen, setIsOpen: setIsCreateMemberOpen } =
    useDialogStore({
      type: DialogType.CreateMember,
    });

  const { data: currentWorkspace } = useQuery({
    ...workspaceOptions({ rowId: workspaceId! }),
    enabled: !!workspaceId,
    select: (data) => data?.workspace,
  });

  const { data: users } = useQuery({
    ...usersOptions(),
    select: (data) => data?.users?.nodes,
  });

  const currentMemberIds =
    currentWorkspace?.workspaceUsers?.nodes.map((u) => u.userId) ?? [];

  const { mutate: addNewMember } = useCreateWorkspaceUserMutation({
    meta: {
      invalidates: [
        ["WorkspaceUsers"],
        workspaceUsersOptions({ rowId: workspaceId! }).queryKey,
      ],
    },
  });

  const form = useForm({
    defaultValues: {
      users: [] as string[],
    },
    onSubmit: async ({ value, formApi }) => {
      for (const user of value.users) {
        addNewMember({
          input: {
            workspaceUser: {
              workspaceId: workspaceId!,
              userId: user,
            },
          },
        });
      }

      formApi.reset();
      setIsCreateMemberOpen(false);
    },
  });

  const usersCollection = createListCollection({
    items:
      users
        // TODO: Filter currentMembers in the query
        ?.filter((user) => !currentMemberIds.includes(user?.rowId))
        ?.map((user) => ({
          label: user?.name || "",
          value: user?.rowId || "",
          user: user,
        })) || [],
  });

  const selectedUsers = useStore(form.store, (state) => state.values.users);

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
            <form.Field name="users">
              {(field) => {
                return (
                  <Select
                    // @ts-ignore TODO: fix type issue
                    collection={usersCollection}
                    multiple
                    value={field.state.value}
                    onValueChange={({ value }) =>
                      value.length ? field.setValue(value) : field.clearValues()
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-between",
                      )}
                    >
                      Select a member
                      <ChevronDownIcon className="ml-auto size-3 transition-transform" />
                    </SelectTrigger>

                    <SelectContent className="max-h-80 min-w-40 overflow-auto">
                      <SelectItemGroup className="space-y-1">
                        {usersCollection.items.map((item) => {
                          return (
                            <SelectItem key={item.value} item={item}>
                              <SelectItemText className="">
                                {item.label}
                              </SelectItemText>
                            </SelectItem>
                          );
                        })}
                      </SelectItemGroup>
                    </SelectContent>
                  </Select>
                );
              }}
            </form.Field>

            {selectedUsers?.length > 0 && (
              <div className="mt-4 flex gap-1 text-sm">
                {selectedUsers.map((user, index) => (
                  <p key={user} className="text-base-500 dark:text-base-400">
                    {
                      usersCollection.items.find((item) => item.value === user)
                        ?.label
                    }
                    {index < selectedUsers.length - 1 ? "," : ""}
                  </p>
                ))}
              </div>
            )}

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
                    Add Member
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

export default CreateMemberDialog;
