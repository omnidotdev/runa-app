import { PlusIcon } from "lucide-react";
import { useState } from "react";

import ColorSelector from "@/components/core/selectors/ColorSelector";
import { Button } from "@/components/ui/button";
import { parseColor } from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import { withForm } from "@/lib/hooks/useForm";
import { cn } from "@/lib/utils";

const TaskLabelsForm = withForm({
  defaultValues: taskFormDefaults,
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
                <div
                  className={cn(
                    "relative flex w-full divide-x",
                    !!field.state.value.length && "border-b",
                  )}
                >
                  <ColorSelector
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

                  <div className="ml-3 flex w-full items-center justify-between gap-2">
                    <Input
                      className="h-7 rounded border-0 shadow-none"
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
                      className="mr-2 h-7 w-7"
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

              {!!field.state.value.length && (
                <div className="flex flex-col gap-1 p-2">
                  {field.state.value.map((label, i) => (
                    <form.Field key={label.name} name={`labels[${i}]`}>
                      {(subField) => (
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
                              className="size-4 rounded-full"
                              style={{
                                backgroundColor: subField.state.value.color,
                              }}
                            />
                            <p className="text-sm">
                              {subField.state.value.name}
                            </p>
                          </div>
                        </div>
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
