import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { useDebounceCallback } from "usehooks-ts";

import { RichTextEditor } from "@/components/core";
import { CardContent, CardHeader, CardRoot } from "@/components/ui/card";
import {
  Role,
  useTaskQuery,
  useTasksQuery,
  useUpdateTaskMutation,
} from "@/generated/graphql";
import workspaceOptions from "@/lib/options/workspace.options";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";

interface Props {
  task: {
    rowId: string;
    isAuthor: boolean;
    description?: string;
  };
}

const TaskDescription = ({ task }: Props) => {
  const { workspaceId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const { data: role } = useSuspenseQuery({
    ...workspaceOptions({ rowId: workspaceId, userId: session?.user?.rowId! }),
    select: (data) => data.workspace?.workspaceUsers.nodes?.[0]?.role,
  });

  const isMember = role === Role.Member;

  const { mutate: updateTask } = useUpdateTaskMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useTaskQuery),
        getQueryKeyPrefix(useTasksQuery),
      ],
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
          editable={task.isAuthor || !isMember}
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
