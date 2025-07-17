import { useFilter, useListCollection } from "@ark-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { TrashIcon } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ComboboxContent,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxPositioner,
  ComboboxRoot,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import { withForm } from "@/lib/hooks/useForm";
import workspaceUsersOptions from "@/lib/options/workspaceUsers.options";

import type { ComponentProps } from "react";

type AdditionalProps = {
  comboboxInputProps?: ComponentProps<typeof ComboboxInput>;
};

interface WorkspaceUser {
  label: string;
  value: string;
  user: {
    name: string;
    avatarUrl?: string | null;
    rowId: string;
  };
}

const UpdateAssignees = withForm({
  defaultValues: taskFormDefaults,
  props: {} as AdditionalProps,
  render: ({ form, comboboxInputProps }) => {
    const { workspaceId } = useLoaderData({ from: "/_auth" });

    const { contains } = useFilter({ sensitivity: "base" });

    const { data: users } = useQuery({
      ...workspaceUsersOptions({ rowId: workspaceId! }),
      enabled: !!workspaceId,
      select: (data) => data?.workspaceUsers?.nodes.map((user) => user.user),
    });

    const { collection: usersCollection, filter } =
      useListCollection<WorkspaceUser>({
        initialItems:
          users?.map((user) => ({
            label: user?.name!,
            value: user?.rowId!,
            user: user!,
          })) ?? [],
        filter: contains,
      });

    return (
      <form.Field name="assignees" mode="array">
        {(field) => {
          return (
            <div className="flex flex-col">
              <ComboboxRoot
                // @ts-ignore TODO type issue
                collection={usersCollection}
                value={field.state.value}
                onInputValueChange={({ inputValue }) => filter(inputValue)}
                onValueChange={({ value }) => field.setValue(value)}
                multiple
              >
                <ComboboxControl>
                  <ComboboxInput
                    className="rounded-none border-x-0 border-t-0 focus-visible:ring-0"
                    placeholder="Search for a user..."
                    {...comboboxInputProps}
                  />
                  <ComboboxTrigger />
                </ComboboxControl>

                <ComboboxPositioner>
                  <ComboboxContent>
                    {usersCollection.items.map((user) => (
                      <ComboboxItem key={user.value} item={user}>
                        {user.label}
                      </ComboboxItem>
                    ))}
                  </ComboboxContent>
                </ComboboxPositioner>
              </ComboboxRoot>
              <div className="flex flex-col gap-1 p-1">
                {field.state.value.length ? (
                  field.state.value.map((assignee, index) => {
                    const workspaceUser = usersCollection.items.find(
                      (u) => u.user?.rowId === assignee,
                    );

                    return (
                      <div
                        key={assignee}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-0">
                          <Avatar
                            fallback={
                              workspaceUser?.user?.name?.charAt(0) ?? "U"
                            }
                            src={workspaceUser?.user?.avatarUrl ?? undefined}
                            alt={workspaceUser?.user?.name}
                            className="size-6 rounded-full border-2 bg-base-200 font-medium text-base-900 text-xs dark:bg-base-600 dark:text-base-100"
                          />

                          <p className="text-xs">{workspaceUser?.user?.name}</p>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => field.removeValue(index)}
                        >
                          <TrashIcon className="size-3" />
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  <p className="place-self-center p-2 text-sm">No Assignees</p>
                )}
              </div>
            </div>
          );
        }}
      </form.Field>
    );
  },
});

export default UpdateAssignees;
