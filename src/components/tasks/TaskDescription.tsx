import { useQueryClient } from "@tanstack/react-query";
import { useLoaderData, useParams } from "@tanstack/react-router";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

import { RichTextEditor } from "@/components/core";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardRoot } from "@/components/ui/card";
import { useTasksQuery, useUpdateTaskMutation } from "@/generated/graphql";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import taskOptions from "@/lib/options/task.options";
import { Role } from "@/lib/permissions";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { cn } from "@/lib/utils";

import type { TaskQuery } from "@/generated/graphql";

const COLLAPSED_HEIGHT = 200;

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

  const { organizationId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const queryClient = useQueryClient();
  const taskQueryKey = taskOptions({ rowId: taskId }).queryKey;

  // Get role from IDP organization claims
  const role = useCurrentUserRole(organizationId);
  const isMember = role === Role.Member;

  // Collapsible state
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Check if content overflows the collapsed height
  const checkOverflow = useCallback(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      setIsOverflowing(scrollHeight > COLLAPSED_HEIGHT);
    }
  }, []);

  // Monitor content changes with ResizeObserver
  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(element);

    return () => observer.disconnect();
  }, [checkOverflow]);

  // Re-check on description change
  // biome-ignore lint: re-run on description length change
  useEffect(() => {
    checkOverflow();
  }, [task?.description, checkOverflow]);

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

  const showCollapse = isOverflowing && !isExpanded;

  return (
    <CardRoot className="p-0 shadow-none">
      <CardHeader className="flex h-10 flex-row items-center justify-between rounded-t-xl border-b bg-base-50 px-3 dark:bg-base-800">
        <h3 className="font-medium text-base-900 text-sm dark:text-base-100">
          Description
        </h3>
        {isOverflowing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 gap-1 px-2 text-muted-foreground text-xs"
          >
            {isExpanded ? (
              <>
                <ChevronUpIcon className="size-3" />
                Show less
              </>
            ) : (
              <>
                <ChevronDownIcon className="size-3" />
                Show more
              </>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent className="relative p-0">
        <div
          ref={contentRef}
          className={cn(
            "overflow-hidden transition-[max-height] duration-300 ease-in-out",
            !isExpanded && isOverflowing && "max-h-[200px]",
          )}
          style={
            isExpanded
              ? { maxHeight: contentRef.current?.scrollHeight }
              : undefined
          }
        >
          <RichTextEditor
            defaultContent={task?.description}
            syncContent={task?.description}
            editable={task.isAuthor || !isMember}
            className="border-0"
            skeletonClassName="h-[120px] rounded-t-none"
            onUpdate={({ getHTML, isEmpty }) => {
              !isEmpty &&
                handleTaskUpdate({
                  rowId: task?.rowId,
                  patch: {
                    description: getHTML(),
                  },
                });
            }}
          />
        </div>
        {/* Gradient fade overlay when collapsed */}
        {showCollapse && (
          <div
            className="pointer-events-none absolute right-px bottom-0 left-px h-16 rounded-b-xl bg-gradient-to-t from-background to-transparent"
            aria-hidden="true"
          />
        )}
      </CardContent>
    </CardRoot>
  );
};

export default TaskDescription;
