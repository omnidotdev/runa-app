import { Droppable } from "@hello-pangea/dnd";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";

import { ColumnHeader } from "@/components/core";
import {
  boardColumnStyles,
  boardContainerStyles,
  boardLayoutStyles,
} from "@/lib/board/styles";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useDragStore from "@/lib/hooks/store/useDragStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useAutoScrollOnDrag from "@/lib/hooks/useAutoScrollOnDrag";
import useInertialScroll from "@/lib/hooks/useInertialScroll";
import useMaxTasksReached from "@/lib/hooks/useMaxTasksReached";
import projectOptions from "@/lib/options/project.options";
import userPreferencesOptions from "@/lib/options/userPreferences.options";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";
import BoardItem from "./BoardItem";
import ColumnMenu from "./ColumnMenu";

import type { TaskFragment } from "@/generated/graphql";

interface Props {
  tasks: TaskFragment[];
}

const Board = ({ tasks }: Props) => {
  const { theme } = useTheme();
  const { isDragging } = useDragStore();

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
      ref={scrollContainerRef}
      className={cn(boardContainerStyles.base, boardContainerStyles.background)}
      style={{
        backgroundColor: userPreferences?.color
          ? theme === "dark"
            ? `${userPreferences?.color}12`
            : `${userPreferences?.color}0D`
          : undefined,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={boardLayoutStyles.innerPadding}>
        <div className={boardLayoutStyles.columnsGap}>
          {project?.columns?.nodes?.map((column) => (
            <div key={column?.rowId} className={boardColumnStyles.wrapper}>
              <ColumnHeader
                title={column.title}
                count={column.tasks?.totalCount ?? 0}
                tooltip={{
                  title: "Add Task",
                  shortcut: "C",
                }}
                emoji={column.emoji}
                onCreate={() => {
                  setColumnId(column.rowId);
                  setIsCreateTaskOpen(true);
                }}
                // TODO: tooltip for disabled state
                disabled={maxTasksReached}
              >
                <ColumnMenu columnId={column.rowId} />
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
                      style={{
                        backgroundColor:
                          userPreferences?.color && snapshot.isDraggingOver
                            ? `${userPreferences?.color}0D`
                            : undefined,
                      }}
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
