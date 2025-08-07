import { useDebounceCallback } from "usehooks-ts";

import RichTextEditor from "@/components/core/RichTextEditor";
import { CardContent, CardHeader, CardRoot } from "@/components/ui/card";
import { useUpdateTaskMutation } from "@/generated/graphql";

interface Props {
  task: {
    description?: string;
    rowId: string;
  };
}

const TaskDescription = ({ task }: Props) => {
  const { mutate: updateTask } = useUpdateTaskMutation({
    meta: {
      invalidates: [["all"]],
    },
  });

  const handleTaskUpdate = useDebounceCallback(updateTask, 300);

  return (
    <CardRoot className="p-0 shadow-none">
      <CardHeader className="flex h-10 flex-row items-center justify-between rounded-t-xl border-b bg-base-50 px-3 dark:bg-base-800">
        <h3 className="font-medium text-base-900 text-sm dark:text-base-100">
          Description
        </h3>
      </CardHeader>
      <CardContent className="p-0">
        <RichTextEditor
          defaultContent={task?.description}
          className="border-0"
          skeletonClassName="h-[120px] rounded-t-none"
          onUpdate={({ editor }) => {
            !editor.isEmpty &&
              handleTaskUpdate({
                rowId: task?.rowId,
                patch: {
                  // TODO: discuss if description should be nullable. Current schema structure doesn't allow it
                  description: editor.getHTML(),
                },
              });
          }}
        />
      </CardContent>
    </CardRoot>
  );
};

export default TaskDescription;
