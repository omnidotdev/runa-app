import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useParams,
  useRouteContext,
} from "@tanstack/react-router";
import { useDebounceCallback } from "usehooks-ts";

import { RichTextEditor } from "@/components/core";
import { CardContent, CardHeader, CardRoot } from "@/components/ui/card";
import { useTasksQuery, useUpdateTaskMutation } from "@/generated/graphql";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import taskOptions from "@/lib/options/task.options";
import workspaceOptions from "@/lib/options/workspace.options";
import { Role } from "@/lib/permissions";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";

import type { TaskQuery } from "@/generated/graphql";

interface Props {
  task: {
    rowId: string;
    isAuthor: boolean;
    description?: string;
  };
}

const TaskDescription = ({ task }: Props) => {
  const { taskId } = useParams({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const { workspaceId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const queryClient = useQueryClient();
  const taskQueryKey = taskOptions({ rowId: taskId }).queryKey;

  const { data: workspace } = useSuspenseQuery({
    ...workspaceOptions({ rowId: workspaceId, userId: session?.user?.rowId! }),
    select: (data) => data.workspace,
  });

  // Get role from IDP organization claims
  const role = useCurrentUserRole(workspace?.organizationId);
  const isMember = role === Role.Member;

  const { mutate: updateTask } = useUpdateTaskMutation({
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: taskQueryKey });
      const previousTask = queryClient.getQueryData(taskQueryKey);

      queryClient.setQueryData<TaskQuery>(taskQueryKey, (old) => {
        if (!old?.task) return old;
        return {
          ...old,
          task: { ...old.task, ...variables.patch },
        } as TaskQuery;
      });

      return { previousTask };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(taskQueryKey, context.previousTask);
      }
    },
    meta: {
      invalidates: [taskQueryKey, getQueryKeyPrefix(useTasksQuery)],
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
