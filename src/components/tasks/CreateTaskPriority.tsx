import { useStore } from "@tanstack/react-form";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import PrioritySelector from "@/components/core/selectors/PrioritySelector";
import { Hotkeys } from "@/lib/constants/hotkeys";
import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import { withForm } from "@/lib/hooks/useForm";

const CreateTaskPriority = withForm({
  defaultValues: taskFormDefaults,
  render: ({ form }) => {
    const priority = useStore(form.store, (state) => state.values.priority);

    const [isPrioritySelectorOpen, setIsPrioritySelectorOpen] = useState(false);

    useHotkeys(
      Hotkeys.UpdateTaskPriority,
      () => setIsPrioritySelectorOpen(!isPrioritySelectorOpen),
      [isPrioritySelectorOpen, setIsPrioritySelectorOpen],
    );

    return (
      <form.Field name="priority">
        {(field) => (
          <PrioritySelector
            open={isPrioritySelectorOpen}
            onOpenChange={({ open }) => setIsPrioritySelectorOpen(open)}
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
