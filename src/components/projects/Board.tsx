import { Droppable } from "@hello-pangea/dnd";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { useMemo } from "react";

import { ColumnHeader } from "@/components/core";
import { useInertialScroll } from "@/components/ui/board";
import {
  boardColumnStyles,
  boardContainerStyles,
  boardLayoutStyles,
} from "@/lib/board/styles";
import { API_BASE_URL } from "@/lib/config/env.config";
import { resolveBackgroundStyle } from "@/lib/constants/backgrounds";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useDragStore from "@/lib/hooks/store/useDragStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useAutoScrollOnDrag from "@/lib/hooks/useAutoScrollOnDrag";
import useMaxTasksReached from "@/lib/hooks/useMaxTasksReached";
import projectOptions from "@/lib/options/project.options";
import userPreferencesOptions from "@/lib/options/userPreferences.options";
import { cn } from "@/lib/utils";
import BoardItem from "./BoardItem";
import ColumnMenu from "./ColumnMenu";
import QuickAddTask from "./QuickAddTask";

import type { TaskFragment } from "@/generated/graphql";

interface Props {
  tasks: TaskFragment[];
}

const Board = ({ tasks }: Props) => {
  const { isDragging } = useDragStore();

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

  // Inertial scroll for drag-to-scroll with momentum
  const {
    scrollContainerRef,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseLeave,
  } = useInertialScroll();

  // Auto-scroll during card drag
  useAutoScrollOnDrag({ isDragging, scrollContainerRef });

  const { projectId, organizationId } = useLoaderData({
    from: "/_app/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const { session } = useRouteContext({
    from: "/_app/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const { setColumnId, setHoveredColumnId, setFocusedColumnId } =
    useTaskStore();

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

  const maxTasksReached = useMaxTasksReached(organizationId);

  const boardBackground = resolveBackgroundStyle(project?.background, {
    assetBaseUrl: API_BASE_URL,
  });
  // Frost columns over any non-neutral background so headers and cards stay
  // legible; the neutral default is left untouched.
  const hasBackground = Boolean(boardBackground);

  return (
    <div
      ref={scrollContainerRef}
      className={cn(boardContainerStyles.base, boardContainerStyles.background)}
      style={boardBackground}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={boardLayoutStyles.innerPadding}>
        <div className={boardLayoutStyles.columnsGap}>
          {project?.columns?.nodes?.map((column) => (
            <div
              key={column?.rowId}
              className={cn(
                boardColumnStyles.wrapper,
                "group outline-none",
                hasBackground &&
                  "rounded-xl bg-background/65 p-2 backdrop-blur-md",
              )}
              // biome-ignore lint/a11y/noNoninteractiveTabindex: focusable wrapper drives keyboard column tracking for quick-add
              tabIndex={0}
              onMouseEnter={() => setHoveredColumnId(column.rowId)}
              onMouseLeave={() => setHoveredColumnId(null)}
              onFocus={() => setFocusedColumnId(column.rowId)}
              onBlur={() => setFocusedColumnId(null)}
            >
              <ColumnHeader
                title={column.title}
                count={column.tasks?.totalCount ?? 0}
                tooltip={{
                  title: "Add Task",
                  shortcut: "C",
                }}
                icon={column.icon}
                onCreate={() => {
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
              </ColumnHeader>

              <div className="flex h-full overflow-hidden">
                <Droppable droppableId={column.rowId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        boardColumnStyles.droppable,
                        snapshot.isDraggingOver &&
                          boardColumnStyles.droppableActive,
                      )}
                    >
                      <div className={boardColumnStyles.itemsContainer}>
                        {tasks
                          .filter((task) => task.columnId === column.rowId)
                          .map((task, index) => (
                            <BoardItem
                              key={task.rowId}
                              task={task}
                              index={index}
                              displayId={`${project?.prefix ?? "PROJ"}-${task.number}`}
                            />
                          ))}
                        {provided.placeholder}
                        <QuickAddTask
                          columnId={column.rowId}
                          projectId={projectId}
                          authorId={session?.user?.rowId!}
                          prefix={project?.prefix ?? "PROJ"}
                          nextTaskNumber={project?.nextTaskNumber ?? 1}
                          columnTasks={tasks.filter(
                            (task) => task.columnId === column.rowId,
                          )}
                          disabled={maxTasksReached}
                        />
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
