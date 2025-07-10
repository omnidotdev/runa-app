import { useStore } from "@tanstack/react-form";

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
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

const priorityConfig = [
  {
    key: "high",
    label: "High",
    className: "bg-red-500 h-3 w-3 rounded-full",
  },
  {
    key: "medium",
    label: "Medium",
    className: "bg-yellow-500 h-3 w-3 rounded-full",
  },
  {
    key: "low",
    label: "Low",
    className: "bg-green-500 h-3 w-3 rounded-full",
  },
];

const CreateTaskDatePicker = withForm({
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
    const priorityCollection = createListCollection({
      items: [
        { label: "Low", value: "low" },
        { label: "Medium", value: "medium" },
        { label: "High", value: "high" },
      ],
    });

    const priority = useStore(form.store, (state) => state.values.priority);
    const currentPriority = priorityConfig.find((p) => p.key === priority);

    return (
      <form.Field name="priority">
        {(field) => (
          <Select
            // @ts-ignore TODO: type issue
            collection={priorityCollection}
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
              <div className={currentPriority?.className} />
              {currentPriority?.label}
            </SelectTrigger>

            <SelectContent>
              <SelectItemGroup className="space-y-1">
                {priorityCollection.items.map((column) => {
                  const priority = priorityConfig.find(
                    (p) => p.key === column.value,
                  );

                  return (
                    <SelectItem key={column.value} item={column}>
                      <SelectItemText>
                        <div className={priority?.className} />
                        {column.label}
                      </SelectItemText>
                    </SelectItem>
                  );
                })}
              </SelectItemGroup>
            </SelectContent>
          </Select>
        )}
      </form.Field>
    );
  },
});

export default CreateTaskDatePicker;
