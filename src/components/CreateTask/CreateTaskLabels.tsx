import { CheckIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
} from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  createListCollection,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemText,
  SelectTrigger,
} from "@/components/ui/select";
import { labelColors } from "@/lib/constants/labelColors";
import { withForm } from "@/lib/hooks/useForm";
import { cn } from "@/lib/utils";

const CreateTaskLabels = withForm({
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
    const [newLabel, setNewLabel] = useState({
      name: "",
      color: "blue",
    });

    const colorCollection = createListCollection({
      items: labelColors.map((color) => ({
        label: color.name,
        value: color.name.toLowerCase(),
        color: color,
      })),
    });

    return (
      <form.Field name="labels" mode="array">
        {(field) => {
          return (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 pb-2">
                {/* TODO: make sure that selection doesn't close popover. Happens if value is outside the bounds of the popover */}
                <Select
                  // @ts-ignore TODO: type issue
                  collection={colorCollection}
                  value={[newLabel.color]}
                  onValueChange={(details) => {
                    setNewLabel((prev) => ({
                      ...prev,
                      color: details.value[0] || "blue",
                    }));
                  }}
                >
                  <SelectTrigger>
                    <div
                      className={cn(
                        "size-4 rounded-full",
                        labelColors.find(
                          (l) => l.name.toLowerCase() === newLabel.color,
                        )?.classes,
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItemGroup>
                      {colorCollection.items.map((item) => (
                        <SelectItem key={item.value} item={item}>
                          <SelectItemText>{item.label}</SelectItemText>

                          <div
                            className={cn(
                              "size-4 rounded-full",
                              item.color.classes,
                            )}
                          />
                        </SelectItem>
                      ))}
                    </SelectItemGroup>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Add new label..."
                  value={newLabel.name}
                  onChange={(e) =>
                    setNewLabel((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!newLabel.name || !newLabel.color}
                  onClick={() =>
                    field.pushValue({
                      name: newLabel.name,
                      color: newLabel.color,
                      checked: true,
                    })
                  }
                >
                  <PlusIcon className="size-4" />
                </Button>
              </div>

              {field.state.value.map((label, i) => {
                return (
                  <form.Field key={label.name} name={`labels[${i}]`}>
                    {(subField) => {
                      return (
                        <CheckboxRoot
                          className="flex items-center justify-between"
                          defaultChecked={subField.state.value.checked}
                          onCheckedChange={({ checked }) =>
                            subField.handleChange({
                              ...subField.state.value,
                              checked: !!checked,
                            })
                          }
                        >
                          <CheckboxLabel className="ml-0">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "size-4 rounded-full",
                                  labelColors.find(
                                    (l) =>
                                      l.name.toLowerCase() ===
                                      subField.state.value.color,
                                  )?.classes,
                                )}
                              />
                              <p className="text-sm">
                                {subField.state.value.name}
                              </p>
                            </div>
                          </CheckboxLabel>
                          <CheckboxHiddenInput />
                          <CheckboxControl>
                            <CheckboxIndicator>
                              <CheckIcon className="size-4" />
                            </CheckboxIndicator>
                          </CheckboxControl>
                        </CheckboxRoot>
                      );
                    }}
                  </form.Field>
                );
              })}
            </div>
          );
        }}
      </form.Field>
    );
  },
});

export default CreateTaskLabels;
