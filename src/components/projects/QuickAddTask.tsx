import { useRouteContext } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import {
  useCreateTaskMutation,
  useProjectQuery,
  useTasksQuery,
} from "@/generated/graphql";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import { keyBetween } from "@/lib/util/fractionalKey";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";

import type { KeyboardEvent } from "react";

interface Props {
  columnId: string;
  projectId: string;
  authorId: string;
  prefix: string;
  nextTaskNumber: number;
  // Tasks already in this column, ordered as the server returns them
  // (COLUMN_INDEX_ASC), used to compute the next fractional key
  columnTasks: { columnIndex: string | null }[];
  disabled?: boolean;
}

const QuickAddTask = ({
  columnId,
  projectId,
  authorId,
  prefix,
  nextTaskNumber,
  columnTasks,
  disabled,
}: Props) => {
  const { quickAddColumnId, setQuickAddColumnId, setColumnId } = useTaskStore();

  const { queryClient } = useRouteContext({
    from: "/_app/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const { mutateAsync: addNewTask } = useCreateTaskMutation();

  const isOpen = quickAddColumnId === columnId;

  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const create = async () => {
    const lastTaskInColumn = columnTasks.at(-1);

    await addNewTask({
      input: {
        task: {
          content: title.trim(),
          description: "",
          projectId,
          columnId,
          authorId,
          columnIndex: keyBetween(lastTaskInColumn?.columnIndex ?? null, null),
        },
      },
    });

    queryClient.invalidateQueries({
      queryKey: getQueryKeyPrefix(useTasksQuery),
    });
    queryClient.invalidateQueries({
      queryKey: getQueryKeyPrefix(useProjectQuery),
    });
  };

  const onKeyDown = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Enter" && (evt.metaKey || evt.ctrlKey)) {
      // Escape hatch to the full dialog seeded with this column
      // TODO: seed the dialog title from the typed value in a later task
      setColumnId(columnId);
      setQuickAddColumnId(null);
      return;
    }

    if (evt.key === "Enter") {
      evt.preventDefault();
      if (!title.trim()) return;

      toast.promise(create(), {
        loading: "Creating task...",
        success: "Task created successfully!",
        error: "Failed to create task. Please try again.",
      });

      // Clear optimistically so the row is immediately ready for the next entry
      setTitle("");
      inputRef.current?.focus();
      return;
    }

    if (evt.key === "Escape") {
      setTitle("");
      setQuickAddColumnId(null);
    }
  };

  const onBlur = () => {
    // Blur-with-text intentionally discards to avoid accidental creates
    if (title.trim()) setTitle("");
    setQuickAddColumnId(null);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => setQuickAddColumnId(columnId)}
        className="w-full rounded-lg border border-border border-dashed py-2 text-base-500 text-xs hover:bg-base-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-base-400 dark:hover:bg-base-900"
      >
        + Add task
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-nowrap font-mono text-base-400 text-xs dark:text-base-500">
        {prefix}-{nextTaskNumber}
      </span>

      <Input
        ref={inputRef}
        className="h-auto border-none bg-transparent px-0 py-1 shadow-none focus-visible:ring-0"
        placeholder="Task title..."
        value={title}
        onChange={(evt) => setTitle(evt.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />
    </div>
  );
};

export default QuickAddTask;
