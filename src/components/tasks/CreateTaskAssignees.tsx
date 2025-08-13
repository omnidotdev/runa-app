import { useSelect } from "@ark-ui/react/select";
import { useField } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { UserPlusIcon, UserXIcon } from "lucide-react";
import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import PopoverWithTooltip from "@/components/core/PopoverWithTooltip";
import Assignees from "@/components/shared/Assignees";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  createListCollection,
  SelectContent,
  SelectControl,
  SelectItem,
  SelectItemGroup,
  SelectItemIndicator,
  SelectItemText,
  SelectPositioner,
  SelectRootProvider,
  SelectTrigger,
} from "@/components/ui/select";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { Hotkeys } from "@/lib/constants/hotkeys";
import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import { withForm } from "@/lib/hooks/useForm";
import workspaceUsersOptions from "@/lib/options/workspaceUsers.options";
import { cn } from "@/lib/utils";
import { SidebarMenuShortcut } from "../ui/sidebar";

const CreateTaskAssignees = withForm({
  defaultValues: taskFormDefaults,
  render: ({ form }) => {
    const { workspaceId } = useLoaderData({ from: "/_auth" });

    const selectButtonRef = useRef<HTMLButtonElement | null>(null);

    const { data: users } = useQuery({
      ...workspaceUsersOptions({ workspaceId: workspaceId! }),
      enabled: !!workspaceId,
      select: (data) =>
        data?.workspaceUsers?.nodes.flatMap((user) => user.user),
    });

    const field = useField({ form, name: "assignees" });

    const usersCollection = createListCollection({
      items: [
        { label: "No Assignees", value: "none", user: undefined },
        ...(users?.map((user) => ({
          label: user?.name || "",
          value: user?.rowId || "",
          user,
        })) ?? []),
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
          <PopoverWithTooltip
            triggerRef={selectButtonRef}
            tooltip="Add Assignees"
            shortcut={Hotkeys.UpdateAssignees.toUpperCase()}
          >
            <SelectRootProvider value={select}>
              <SelectControl>
                <SelectTrigger ref={selectButtonRef} asChild>
                  <TooltipTrigger asChild>
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
                  </TooltipTrigger>
                </SelectTrigger>
              </SelectControl>

              <SelectPositioner>
                <SelectContent className="max-h-80 w-48 overflow-auto p-0">
                  <div className="flex w-full items-center justify-between border-b p-2 text-base-500 text-sm">
                    Assignees{" "}
                    <SidebarMenuShortcut>
                      {Hotkeys.UpdateAssignees.toUpperCase()}
                    </SidebarMenuShortcut>
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
                                <Avatar
                                  src={item.user?.avatarUrl ?? undefined}
                                  alt={item.user?.name}
                                  fallback={item.user?.name?.charAt(0)}
                                  className="size-6 rounded-full border p-0 shadow"
                                />
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
          </PopoverWithTooltip>
        )}
      </form.Field>
    );
  },
});

export default CreateTaskAssignees;
