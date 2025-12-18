import { Droppable } from "@hello-pangea/dnd";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";

import ColumnHeader from "@/components/core/ColumnHeader";
import BoardItem from "@/components/projects/BoardItem";
import ColumnMenu from "@/components/projects/ColumnMenu";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useMaxTasksReached from "@/lib/hooks/useMaxTasksReached";
import projectOptions from "@/lib/options/project.options";
import userPreferencesOptions from "@/lib/options/userPreferences.options";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";

import type { TaskFragment } from "@/generated/graphql";

interface Props {
  tasks: TaskFragment[];
}

const Board = ({ tasks }: Props) => {
  const { theme } = useTheme();

  const { projectId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const navigate = useNavigate({
    from: "/workspaces/$workspaceSlug/projects/$projectSlug",
  });

  const { setColumnId } = useTaskStore();

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

  const taskIndex = (taskId: string) =>
    project?.columns?.nodes
      ?.flatMap((column) => column?.tasks?.nodes?.map((task) => task))
      .sort(
        (a, b) =>
          new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime(),
      )
      .map((task) => task?.rowId)
      .indexOf(taskId) ?? 0;

  return (
    <div
      className="custom-scrollbar h-full select-none overflow-x-auto bg-primary-100/30 dark:bg-primary-950/15"
      style={{
        backgroundColor: userPreferences?.color
          ? theme === "dark"
            ? `${userPreferences?.color}12`
            : `${userPreferences?.color}0D`
          : undefined,
      }}
    >
      <div className="h-full min-w-fit p-4">
        <div className="flex h-full gap-3">
          {project?.columns?.nodes?.map((column) => (
            <div
              key={column?.rowId}
              className="relative flex h-full w-[340px] flex-col gap-2 bg-inherit"
            >
              <ColumnHeader
                title={column.title}
                count={
                  project?.columns?.nodes?.find(
                    (c) => c?.rowId === column?.rowId,
                  )?.tasks?.totalCount ?? 0
                }
                tooltip={{
                  title: "Add Task",
                  shortCut: "C",
                }}
                emoji={column.emoji}
                onCreate={() => {
                  setColumnId(column.rowId);
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      createTask: true,
                    }),
                  });
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
                        "flex flex-1 flex-col rounded-xl bg-background/60 p-2 dark:bg-background/20",
                        snapshot.isDraggingOver &&
                          "bg-primary-100/40 dark:bg-primary-950/40",
                      )}
                      style={{
                        backgroundColor:
                          userPreferences?.color && snapshot.isDraggingOver
                            ? `${userPreferences?.color}0D`
                            : undefined,
                      }}
                    >
                      <div className="no-scrollbar flex h-full flex-col overflow-y-auto p-1">
                        {tasks
                          .filter((task) => task.columnId === column.rowId)
                          .map((task, index) => {
                            const displayId = `${project?.prefix ?? "PROJ"}-${taskIndex(
                              task.rowId,
                            )}`;

                            return (
                              <BoardItem
                                key={task.rowId}
                                task={task}
                                index={index}
                                displayId={displayId}
                              />
                            );
                          })}
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
