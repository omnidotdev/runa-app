import { useStore } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";

import ColumnSelector from "@/components/core/ColumnSelector";
import { createListCollection } from "@/components/ui/select";
import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import { withForm } from "@/lib/hooks/useForm";
import projectOptions from "@/lib/options/project.options";

const TaskColumnForm = withForm({
  defaultValues: taskFormDefaults,
  render: ({ form }) => {
    const { projectId } = useLoaderData({
      from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
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

    const column = useStore(form.store, (state) => state.values.columnId);
    const currentColumn = projectColumns.items.find((c) => c.value === column);

    return (
      <form.Field name="columnId">
        {(field) => {
          return (
            <ColumnSelector
              projectId={projectId}
              defaultValue={
                form.state.values.columnId ? [form.state.values.columnId] : []
              }
              onValueChange={({ value }) =>
                value.length ? field.setValue(value[0]) : field.clearValues()
              }
              triggerLabel={currentColumn?.label}
              triggerEmoji={currentColumn?.column?.emoji ?? undefined}
            />
          );
        }}
      </form.Field>
    );
  },
});

export default TaskColumnForm;
