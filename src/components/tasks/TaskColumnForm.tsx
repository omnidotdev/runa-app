import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

import { columnIcons } from "@/components/Tasks";
import { buttonVariants } from "@/components/ui/button";
import {
  createListCollection,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemText,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { withForm } from "@/lib/hooks/useForm";
import projectOptions from "@/lib/options/project.options";
import { cn } from "@/lib/utils";

const TaskColumnForm = withForm({
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
    const { projectId } = useParams({
      from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
    });

    const { data: project } = useSuspenseQuery({
      ...projectOptions({ rowId: projectId }),
      select: (data) => data?.project,
    });

    const projectColumns = createListCollection({
      items:
        project?.columns.nodes.map((column) => ({
          label: column?.title || "",
          value: column?.rowId || "",
          column: column,
        })) || [],
    });

    return (
      <form.Field name="columnId">
        {(field) => {
          return (
            <Select
              // @ts-ignore TODO: fix type issue
              collection={projectColumns}
              defaultValue={
                form.state.values.columnId ? [form.state.values.columnId] : []
              }
              onValueChange={({ value }) =>
                value.length ? field.setValue(value[0]) : field.clearValues()
              }
            >
              <SelectTrigger
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "[&[data-state=open]>svg]:rotate-0 [&_svg:not([class*='text-'])]:text-foreground",
                )}
              >
                <div className="flex items-center gap-2">
                  <form.Subscribe
                    selector={(state) => ({
                      columnId: state.values.columnId,
                    })}
                  >
                    {({ columnId }) => (
                      <div className="flex flex-col gap-2">
                        <div>
                          {
                            columnIcons[
                              project?.columns?.nodes
                                ?.find((c) => c?.rowId === columnId)
                                ?.title.toLowerCase()
                                .replace(/ /g, "-") as keyof typeof columnIcons
                            ]
                          }
                        </div>
                      </div>
                    )}
                  </form.Subscribe>
                  <SelectValueText />
                </div>
              </SelectTrigger>

              <SelectContent className="max-h-80 overflow-auto">
                <SelectItemGroup className="flex flex-col gap-1">
                  {projectColumns.items.map((item) => {
                    return (
                      <SelectItem
                        key={item.value}
                        item={item}
                        className="flex items-center justify-start gap-1 px-1 py-0.5"
                      >
                        {
                          columnIcons[
                            item?.label
                              .toLowerCase()
                              .replace(/ /g, "-") as keyof typeof columnIcons
                          ]
                        }
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

export default TaskColumnForm;
