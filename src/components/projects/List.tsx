import { Droppable } from "@hello-pangea/dnd";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { useMemo } from "react";

import { ColumnTrigger } from "@/components/core";
import {
  CollapsibleContent,
  CollapsibleRoot,
} from "@/components/ui/collapsible";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useMaxTasksReached from "@/lib/hooks/useMaxTasksReached";
import projectOptions from "@/lib/options/project.options";
import userPreferencesOptions from "@/lib/options/userPreferences.options";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";
import ColumnMenu from "./ColumnMenu";
import ListItem from "./ListItem";

import type { Dispatch, SetStateAction } from "react";
import type { TaskFragment } from "@/generated/graphql";

interface Props {
  tasks: TaskFragment[];
  openStates: boolean[];
  setOpenStates: Dispatch<SetStateAction<boolean[]>>;
  setIsForceClosed: (value: boolean) => void;
}

const List = ({
  tasks,
  openStates,
  setOpenStates,
  setIsForceClosed,
}: Props) => {
  const { theme } = useTheme();

  // Compute task IDs by column to pass to ColumnMenu (avoids N+1 Column queries)
  const taskIdsByColumn = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        if (!acc[task.columnId]) acc[task.columnId] = [];
        acc[task.columnId].push(task.rowId);
        return acc;
      },
      {} as Record<string, string[]>,
    );
  }, [tasks]);

  const { projectId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const { setColumnId } = useTaskStore();

  const { setIsOpen: setIsCreateTaskOpen } = useDialogStore({
    type: DialogType.CreateTask,
  });

  const { data: userPreferences } = useSuspenseQuery({
    ...userPreferencesOptions({
      userId: session?.user?.rowId!,
      projectId,
    }),
    select: (data) => data?.userPreferenceByUserIdAndProjectId,
  });

  const { data: project } = useQuery({
    ...projectOptions({
      rowId: projectId,
    }),
    select: (data) => ({
      ...data?.project,
      columns: {
        ...data?.project?.columns,
        nodes: data?.project?.columns?.nodes?.filter(
          (column) => !userPreferences?.hiddenColumnIds.includes(column.rowId),
        ),
      },
    }),
  });

  const maxTasksReached = useMaxTasksReached();

  return (
    <div
      className="custom-scrollbar h-full overflow-y-auto bg-primary-100/30 p-4 dark:bg-primary-950/20"
      style={{
        backgroundColor: userPreferences?.color
          ? theme === "dark"
            ? `${userPreferences?.color}12`
            : `${userPreferences?.color}0D`
          : undefined,
      }}
    >
      {project?.columns?.nodes?.map((column, index) => {
        const columnTasks = tasks.filter(
          (task) => task.columnId === column.rowId,
        );

        return (
          <CollapsibleRoot
            key={column?.rowId}
            className="mb-4 rounded-lg border bg-background last:mb-0"
            open={openStates[index]}
            onOpenChange={({ open }) => {
              setOpenStates((prev) => {
                const newStates = [...prev];
                newStates[index] = open;

                if (newStates.every((state) => state === false)) {
                  setIsForceClosed(true);
                }

                if (newStates.every((state) => state === true)) {
                  setIsForceClosed(false);
                }

                return newStates;
              });
            }}
          >
            <ColumnTrigger
              title={column.title}
              count={column.tasks?.totalCount ?? 0}
              tooltip={{
                title: "Add Task",
                shortcut: "C",
              }}
              icon={column.icon}
              onCreate={(e) => {
                e.preventDefault();
                setColumnId(column.rowId);
                setIsCreateTaskOpen(true);
              }}
              // TODO: tooltip for disabled state
              disabled={maxTasksReached}
            >
              <ColumnMenu
                columnId={column.rowId}
                taskIds={taskIdsByColumn[column.rowId] ?? []}
              />
            </ColumnTrigger>

            <CollapsibleContent className="rounded-b-lg p-0">
              {/* NB: Fade in the top border to avoid clashing with the parent border during animation */}
              <div className="border-t transition-opacity ease-in-out" />
              <Droppable droppableId={column.rowId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "divide-y divide-base-200 overflow-hidden dark:divide-base-700",
                      snapshot.isDraggingOver &&
                        "bg-primary-100/40 dark:bg-primary-950/30",
                    )}
                    style={{
                      backgroundColor:
                        userPreferences?.color && snapshot.isDraggingOver
                          ? `${userPreferences?.color}0D`
                          : undefined,
                    }}
                  >
                    {columnTasks?.length === 0 ? (
                      <p
                        className={cn(
                          "p-2 pl-2 text-muted-foreground text-xs",
                          snapshot.isDraggingOver && "hidden",
                        )}
                      >
                        No tasks
                      </p>
                    ) : (
                      columnTasks.map((task, index) => (
                        <ListItem
                          key={task.rowId}
                          task={task}
                          index={index}
                          displayId={`${project?.prefix ?? "PROJ"}-${task.number}`}
                        />
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CollapsibleContent>
          </CollapsibleRoot>
        );
      })}
    </div>
  );
};

export default List;
