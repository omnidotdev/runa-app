import { PlusIcon } from "lucide-react";
import { useState } from "react";

import ColorSelector from "@/components/core/ColorSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { labelColors } from "@/lib/constants/labelColors";
import { withForm } from "@/lib/hooks/useForm";
import { cn } from "@/lib/utils";

const TaskLabelsForm = withForm({
  defaultValues: {
    title: "",
    description: "",
    labels: [] as {
      name: string;
      color: string;
      checked: boolean;
      rowId: string;
    }[],
    assignees: [] as string[],
    dueDate: "",
    columnId: "",
    priority: "low",
  },
  render: ({ form }) => {
    const [newLabel, setNewLabel] = useState({
      name: "",
      color: "blue",
    });

    return (
      <form.Field name="labels" mode="array">
        {(field) => {
          return (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="relative flex w-full border-b">
                  <ColorSelector
                    triggerValue={newLabel.color}
                    value={[newLabel.color]}
                    onValueChange={(details) => {
                      setNewLabel((prev) => ({
                        ...prev,
                        color: details.value[0] || "blue",
                      }));
                    }}
                  />
                  <div className="flex w-full items-center justify-between">
                    <Input
                      className="rounded-none border-0 border-l shadow-none focus-visible:ring-0"
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

                          field.pushValue({
                            name: newLabel.name,
                            color: newLabel.color,
                            rowId: "pending",
                            checked: true,
                          });

                          setNewLabel({
                            name: "",
                            color: "blue",
                          });
                        }
                      }}
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={!newLabel.name || !newLabel.color}
                      className="mr-1 h-7 w-7"
                      onClick={() =>
                        field.pushValue({
                          name: newLabel.name,
                          color: newLabel.color,
                          rowId: "pending",
                          checked: true,
                        })
                      }
                    >
                      <PlusIcon className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 p-2">
                {field.state.value.map((label, i) => {
                  return (
                    <form.Field key={label.name} name={`labels[${i}]`}>
                      {(subField) => {
                        return (
                          <div
                            // NB: styles are mimicking the select item styles
                            className={cn(
                              "cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent dark:hover:bg-accent/50",
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
                                className={cn(
                                  "flex size-4 items-center gap-2 rounded-full",
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
                          </div>
                        );
                      }}
                    </form.Field>
                  );
                })}
              </div>
            </div>
          );
        }}
      </form.Field>
    );
  },
});

export default TaskLabelsForm;
// <CheckboxRoot
//   className="flex items-center justify-between p-2"
//   checked={subField.state.value.checked}
//   onCheckedChange={({ checked }) =>
//     subField.handleChange({
//       ...subField.state.value,
//       checked: !!checked,
//     })
//   }
// >
//   <CheckboxLabel className="ml-0">
//     <div className="flex items-center gap-2">
//       <div
//         className={cn(
//           "size-4 rounded-full",
//           labelColors.find(
//             (l) => l.name.toLowerCase() === subField.state.value.color,
//           )?.classes,
//         )}
//       />
//       <p className="text-sm">{subField.state.value.name}</p>
//     </div>
//   </CheckboxLabel>
//   <CheckboxHiddenInput />
//   <CheckboxControl>
//     <CheckboxIndicator>
//       <CheckIcon className="size-4" />
//     </CheckboxIndicator>
//   </CheckboxControl>
// </CheckboxRoot>;
