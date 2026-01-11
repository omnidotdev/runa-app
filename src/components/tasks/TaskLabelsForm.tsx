import { useField } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { CheckIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { ColorSelector } from "@/components/core";
import { Button } from "@/components/ui/button";
import { parseColor } from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import { Role } from "@/generated/graphql";
import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import { withForm } from "@/lib/hooks/useForm";
import workspaceOptions from "@/lib/options/workspace.options";
import { cn } from "@/lib/utils";

const TaskLabelsForm = withForm({
  defaultValues: taskFormDefaults,
  render: ({ form }) => {
    const [newLabel, setNewLabel] = useState({
      name: "",
      color: "blue",
    });

    const { workspaceId } = useLoaderData({
      from: "/_auth",
    });

    const { session } = useRouteContext({
      from: "/_auth",
    });

    const { data: role } = useSuspenseQuery({
      // TODO: determine if the non-null assertion on `workspaceId` is ok
      ...workspaceOptions({
        rowId: workspaceId!,
        userId: session?.user?.rowId!,
      }),
      select: (data) => data?.workspace?.members?.nodes?.[0]?.role,
    });

    const isMember = role === Role.Member;

    const field = useField({ form, name: "labels" });

    const addNewLabel = () => {
      if (!newLabel.name || !newLabel.color) return;

      field.pushValue({
        name: newLabel.name,
        color: newLabel.color,
        rowId: "pending",
        checked: true,
      });

      setNewLabel({ name: "", color: "blue" });
    };

    return (
      <form.Field name="labels" mode="array">
        {(field) => {
          return (
            <div className="flex flex-col gap-0">
              <div
                className={cn(
                  "flex h-fit w-full items-center gap-2 divide-x",
                  isMember && "hidden",
                )}
              >
                <ColorSelector
                  showChannelInput={false}
                  positioning={{
                    strategy: "fixed",
                    placement: "bottom",
                  }}
                  value={parseColor(newLabel.color)}
                  onValueChange={(details) => {
                    setNewLabel((prev) => ({
                      ...prev,
                      color: details.value.toString("hex"),
                    }));
                  }}
                />

                <Input
                  id="label-name"
                  autoComplete="off"
                  className="h-7 rounded border-0 px-2 shadow-none"
                  placeholder="Add new label..."
                  value={newLabel.name}
                  onChange={(e) =>
                    setNewLabel((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newLabel.name && newLabel.color) {
                      e.preventDefault();
                      addNewLabel();
                    }
                  }}
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  disabled={!newLabel.name || !newLabel.color}
                  className="mr-2 size-7"
                  onClick={addNewLabel}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addNewLabel();
                    }
                  }}
                >
                  <PlusIcon className="size-4" />
                </Button>
              </div>

              {!!field.state.value.length && (
                <div className="flex flex-col gap-1 border-t p-1">
                  {field.state.value.map((label, i) => (
                    <form.Field key={label.name} name={`labels[${i}]`}>
                      {(subField) => (
                        <Button
                          variant="ghost"
                          className={cn(
                            "flex w-full items-center justify-between",
                            subField.state.value.checked
                              ? "bg-base-100 text-foreground hover:bg-base-200 dark:bg-base-700 dark:text-foreground dark:hover:bg-base-800"
                              : "text-muted-foreground",
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            subField.handleChange({
                              ...subField.state.value,
                              checked: !subField.state.value.checked,
                            });
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="size-4 rounded-full"
                              style={{
                                backgroundColor: subField.state.value.color,
                              }}
                            />
                            {subField.state.value.name}
                          </div>

                          <CheckIcon
                            className={cn(
                              "ml-auto text-green-500 transition-opacity",
                              subField.state.value.checked
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </Button>
                      )}
                    </form.Field>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      </form.Field>
    );
  },
});

export default TaskLabelsForm;
