import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { UserPlusIcon } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  createListCollection,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemText,
  SelectTrigger,
} from "@/components/ui/select";
import { withForm } from "@/lib/hooks/useForm";
import workspaceUsersOptions from "@/lib/options/workspaceUsers.options";
import { cn } from "@/lib/utils";

const CreateTaskAssignees = withForm({
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
    columnId: "",
  },
  render: ({ form }) => {
    const { workspaceId } = useParams({ strict: false });

    const { data: users } = useQuery({
      ...workspaceUsersOptions({ rowId: workspaceId! }),
      enabled: !!workspaceId,
      select: (data) =>
        data?.workspaceUsers?.nodes.flatMap((user) => user.user),
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
      <form.Field name="assignees">
        {(field) => {
          return (
            <Select
              // @ts-ignore TODO: fix type issue
              collection={usersCollection}
              multiple
              onValueChange={({ value }) =>
                value.length ? field.setValue(value) : field.clearValues()
              }
            >
              <SelectTrigger
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "[&[data-state=open]>svg]:rotate-0 [&_svg:not([class*='text-'])]:text-foreground",
                )}
              >
                <UserPlusIcon className="size-4" />
                Assign
              </SelectTrigger>

              <SelectContent className="max-h-80 overflow-auto">
                <SelectItemGroup className="flex flex-col gap-1">
                  {usersCollection.items.map((item) => {
                    return (
                      <SelectItem
                        key={item.value}
                        item={item}
                        className="flex items-center justify-start gap-1 px-1 py-0.5"
                      >
                        <Avatar
                          src={item.user?.avatarUrl!}
                          alt={item.user?.name}
                          fallback={item.user?.name?.charAt(0)}
                          className="size-6 rounded-full"
                        />
                        <SelectItemText>{item.label}</SelectItemText>
                      </SelectItem>
                    );
                  })}
                </SelectItemGroup>
              </SelectContent>
            </Select>
          );
        }}
      </form.Field>
    );
  },
});

export default CreateTaskAssignees;
