import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { CheckIcon } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
} from "@/components/ui/checkbox";
import { createListCollection } from "@/components/ui/select";
import { withForm } from "@/lib/hooks/useForm";
import workspacesUsersOptions from "@/lib/options/workspaceUsers.options";

// TODO: update structure. Use combobox to search for assignees and show currently assigned only with `XIcon` to remove

const UpdateAssignees = withForm({
  defaultValues: {
    title: "",
    description: "",
    labels: [] as {
      name: string;
      color: string;
      checked: boolean;
    }[],
    assignees: [] as string[],
    dueDate: "",
  },
  render: ({ form }) => {
    const { workspaceId } = useParams({ strict: false });

    const { data: users } = useQuery({
      ...workspacesUsersOptions(workspaceId!),
      enabled: !!workspaceId,
      select: (data) =>
        data?.workspaceUsers?.nodes.flatMap((user) => user?.user),
    });

    const usersCollection = createListCollection({
      items:
        users?.map((user) => ({
          label: user?.name || "",
          value: user?.rowId || "",
          user: user,
        })) || [],
    });

    return (
      <form.Field name="assignees" mode="array">
        {(field) => {
          return (
            <div className="no-scrollbar flex max-h-40 flex-col overflow-auto">
              {usersCollection.items.map((assignee) => (
                <CheckboxRoot
                  key={assignee?.value}
                  className="flex items-center justify-between"
                  defaultChecked={field.state.value.includes(assignee?.value)}
                  onCheckedChange={({ checked }) => {
                    checked
                      ? field.insertValue(
                          field.state.value.length,
                          assignee?.value,
                        )
                      : field.removeValue(
                          field.state.value.indexOf(assignee?.value),
                        );
                  }}
                >
                  <CheckboxLabel className="ml-0">
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={assignee?.user?.avatarUrl!}
                        alt={assignee?.user?.name}
                        fallback={assignee?.user?.name?.charAt(0)}
                        className="size-6 rounded-full"
                      />
                      <p className="text-sm">{assignee?.user?.name}</p>
                    </div>
                  </CheckboxLabel>
                  <CheckboxHiddenInput />
                  <CheckboxControl>
                    <CheckboxIndicator>
                      <CheckIcon className="size-4" />
                    </CheckboxIndicator>
                  </CheckboxControl>
                </CheckboxRoot>
              ))}
            </div>
          );
        }}
      </form.Field>
    );
  },
});

export default UpdateAssignees;
