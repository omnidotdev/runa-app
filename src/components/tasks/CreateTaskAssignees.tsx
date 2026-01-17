import { useSelect } from "@ark-ui/react/select";
import { useField } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { UserPlusIcon, UserXIcon } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";

import { Assignees, Shortcut, Tooltip } from "@/components/core";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  SelectContent,
  SelectControl,
  SelectItem,
  SelectItemGroup,
  SelectItemIndicator,
  SelectItemText,
  SelectPositioner,
  SelectRootProvider,
  SelectTrigger,
  createListCollection,
} from "@/components/ui/select";
import { Hotkeys } from "@/lib/constants/hotkeys";
import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import { withForm } from "@/lib/hooks/useForm";
import organizationMembersOptions from "@/lib/options/organizationMembers.options";
import { cn } from "@/lib/utils";

const CreateTaskAssignees = withForm({
  defaultValues: taskFormDefaults,
  render: ({ form }) => {
    const { organizationId } = useLoaderData({ from: "/_auth" });
    const { session } = useRouteContext({ from: "/_auth" });

    // Fetch organization members from IDP
    const { data: membersData } = useQuery({
      ...organizationMembersOptions({
        organizationId: organizationId!,
        accessToken: session?.accessToken!,
      }),
      enabled: !!organizationId && !!session?.accessToken,
    });

    const users = membersData?.data ?? [];

    const field = useField({ form, name: "assignees" });

    const usersCollection = createListCollection({
      items: [
        { label: "No Assignees", value: "none", user: undefined },
        ...users.map((member) => ({
          label: member.user.name || "",
          value: member.userId,
          user: {
            name: member.user.name,
            avatarUrl: member.user.image,
            rowId: member.userId,
          },
        })),
      ],
    });

    const select = useSelect({
      collection: usersCollection,
      multiple: true,
      value: field.state.value.length ? field.state.value : ["none"],
      onValueChange: ({ value }) => {
        const noneIndex = value.indexOf("none");
        const lastIndex = value.length - 1;

        value.length
          ? field.setValue(
              noneIndex !== -1 && noneIndex === lastIndex
                ? ["none"]
                : noneIndex !== -1
                  ? value.filter((v) => v !== "none")
                  : value,
            )
          : field.clearValues();
      },
      loopFocus: true,
    });

    useHotkeys(Hotkeys.UpdateAssignees, () => select.setOpen(!select.open), [
      select.open,
      select.setOpen,
    ]);

    return (
      <form.Field name="assignees">
        {() => (
          <SelectRootProvider value={select}>
            <Tooltip
              positioning={{ placement: "top" }}
              tooltip="Add Assignees"
              shortcut={Hotkeys.UpdateAssignees}
              trigger={
                <SelectControl>
                  <SelectTrigger asChild>
                    <Button variant="outline">
                      {select.value.includes("none") ||
                      select.value.length === 0 ? (
                        <div className="flex items-center gap-2">
                          <UserPlusIcon className="size-4" />
                          <p className="hidden text-sm md:flex">Assign</p>
                        </div>
                      ) : (
                        <Assignees
                          showUsername={select.value.length === 1}
                          assignees={select.value}
                          className={cn(
                            "-mx-2 flex h-9 w-fit items-center",
                            select.value.length > 1 ? "pr-0" : "md:pr-2",
                          )}
                        />
                      )}
                    </Button>
                  </SelectTrigger>
                </SelectControl>
              }
            />

            <SelectPositioner>
              <SelectContent className="max-h-80 w-48 overflow-auto p-0">
                <div className="flex w-full items-center justify-between border-b p-2 text-base-500 text-sm">
                  Assignees <Shortcut>{Hotkeys.UpdateAssignees}</Shortcut>
                </div>

                <SelectItemGroup className="space-y-1 p-1">
                  {usersCollection.items.map((item) => {
                    return (
                      <SelectItem key={item.value} item={item}>
                        <SelectItemText className="max-h-9">
                          {item.value === "none" ? (
                            <UserXIcon className="ml-1.5 size-4" />
                          ) : (
                            <div className="-m-2">
                              <AvatarRoot className="mr-2 size-6 rounded-full border p-0 shadow">
                                <AvatarImage
                                  src={item.user?.avatarUrl ?? undefined}
                                  alt={item.user?.name}
                                />
                                <AvatarFallback>
                                  {item.user?.name?.charAt(0)}
                                </AvatarFallback>
                              </AvatarRoot>
                            </div>
                          )}
                          {item.label}
                        </SelectItemText>
                        <SelectItemIndicator />
                      </SelectItem>
                    );
                  })}
                </SelectItemGroup>
              </SelectContent>
            </SelectPositioner>
          </SelectRootProvider>
        )}
      </form.Field>
    );
  },
});

export default CreateTaskAssignees;
