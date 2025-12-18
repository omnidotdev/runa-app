import { useField, useStore } from "@tanstack/react-form";
import { PlusIcon, TagIcon } from "lucide-react";
import { useId, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import Shortcut from "@/components/core/Shortcut";
import ColorSelector from "@/components/core/selectors/ColorSelector";
import Tooltip from "@/components/core/Tooltip";
import { Button } from "@/components/ui/button";
import { parseColor } from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import {
  MenuCheckboxItem,
  MenuContent,
  MenuItemGroup,
  MenuItemIndicator,
  MenuItemText,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { Hotkeys } from "@/lib/constants/hotkeys";
import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import { withForm } from "@/lib/hooks/useForm";

const CreateTaskLabels = withForm({
  defaultValues: taskFormDefaults,
  render: ({ form }) => {
    const triggerId = useId();

    const taskLabels = useStore(
      form.store,
      (state) => state.values.labels,
    ).filter((label) => label.checked);

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [newLabel, setNewLabel] = useState({
      name: "",
      color: "blue",
    });

    const field = useField({ form, name: "labels" });

    // TODO: Fix issue adding a space in the label name in the create task dialog.
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

    useHotkeys(
      Hotkeys.UpdateTaskLabels,
      () => setIsPopoverOpen(!isPopoverOpen),
      [isPopoverOpen, setIsPopoverOpen],
    );

    return (
      <form.Field name="labels" mode="array">
        {() => (
          <MenuRoot
            positioning={{
              placement: "bottom-start",
            }}
            ids={{ trigger: triggerId }}
            open={isPopoverOpen}
            onOpenChange={({ open }) => setIsPopoverOpen(open)}
            loopFocus
          >
            <Tooltip
              positioning={{ placement: "top" }}
              ids={{ trigger: triggerId }}
              tooltip="Add labels"
              shortcut={Hotkeys.UpdateTaskLabels}
              trigger={
                <MenuTrigger asChild>
                  <Button variant="outline">
                    {taskLabels.length === 0 && (
                      <>
                        <TagIcon className="size-4" />
                        <p className="hidden md:flex">Labels</p>
                      </>
                    )}

                    {taskLabels.length === 1 && (
                      <div className="flex items-center gap-2">
                        <div
                          className="size-4 rounded-full shadow"
                          style={{
                            backgroundColor: taskLabels[0].color,
                          }}
                        />
                        <p className="hidden md:flex">{taskLabels[0].name}</p>
                      </div>
                    )}

                    {taskLabels.length > 1 && (
                      <div className="flex items-center gap-2">
                        <div className="-mx-1 flex items-center -space-x-1">
                          {taskLabels.map((label) => (
                            <div
                              key={label.rowId}
                              className="size-4 rounded-full border"
                              style={{ backgroundColor: label.color }}
                            />
                          ))}
                        </div>
                        <p className="hidden md:flex">{taskLabels.length}</p>
                        <p className="hidden md:flex">
                          {taskLabels.length > 1 ? "Labels" : "Label"}
                        </p>
                      </div>
                    )}
                  </Button>
                </MenuTrigger>
              }
            />

            <MenuPositioner>
              <MenuContent className="flex min-w-fit flex-col gap-0 p-0">
                <div className="flex w-full items-center justify-between border-b p-2 text-base-500 text-sm">
                  Labels <Shortcut>{Hotkeys.UpdateTaskLabels}</Shortcut>
                </div>

                <form.Field name="labels" mode="array">
                  {(field) => {
                    return (
                      <div className="flex flex-col gap-0 pt-1">
                        <div className="-mt-1 flex h-fit w-full items-center gap-2 divide-x">
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
                            className="rounded border-0 px-2 shadow-none"
                            placeholder="Add new label..."
                            value={newLabel.name}
                            onChange={(e) =>
                              setNewLabel((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                newLabel.name &&
                                newLabel.color
                              ) {
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

                        <MenuItemGroup className="-mt-1">
                          <MenuSeparator />

                          {field.state.value.length ? (
                            <div className="mt-1 flex flex-col gap-1">
                              {field.state.value.map((label, i) => (
                                <form.Field
                                  key={label.name}
                                  name={`labels[${i}]`}
                                >
                                  {(subField) => (
                                    <MenuCheckboxItem
                                      closeOnSelect={false}
                                      value={`labels[${i}]`}
                                      checked={subField.state.value.checked}
                                      onCheckedChange={(checked) => {
                                        subField.handleChange({
                                          ...subField.state.value,
                                          checked,
                                        });
                                      }}
                                    >
                                      <MenuItemText className="flex items-center gap-2">
                                        <div
                                          className="size-4 rounded-full"
                                          style={{
                                            backgroundColor:
                                              subField.state.value.color,
                                          }}
                                        />
                                        {subField.state.value.name}
                                      </MenuItemText>
                                      <MenuItemIndicator />
                                    </MenuCheckboxItem>
                                  )}
                                </form.Field>
                              ))}
                            </div>
                          ) : (
                            <p className="-mt-1 px-3 py-2 text-sm">
                              No labels added
                            </p>
                          )}
                        </MenuItemGroup>
                      </div>
                    );
                  }}
                </form.Field>
              </MenuContent>
            </MenuPositioner>
          </MenuRoot>
        )}
      </form.Field>
    );
  },
});

export default CreateTaskLabels;
