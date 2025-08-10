import { useStore } from "@tanstack/react-form";

import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import { withForm } from "@/lib/hooks/useForm";
import PrioritySelector from "../core/selectors/PrioritySelector";

const CreateTaskPriority = withForm({
  defaultValues: taskFormDefaults,
  render: ({ form }) => {
    const priority = useStore(form.store, (state) => state.values.priority);

    return (
      <form.Field name="priority">
        {(field) => (
          <PrioritySelector
            defaultValue={
              form.state.values.priority ? [form.state.values.priority] : []
            }
            onValueChange={({ value }) =>
              value.length ? field.setValue(value[0]) : field.clearValues()
            }
            triggerValue={priority}
          />
        )}
      </form.Field>
    );
  },
});

export default CreateTaskPriority;
