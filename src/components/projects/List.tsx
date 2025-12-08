import { Droppable } from "@hello-pangea/dnd";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";

import ColumnMenu from "@/components/projects/ColumnMenu";
import ListItem from "@/components/projects/ListItem";
import ListTrigger from "@/components/shared/ListTrigger";
import {
  CollapsibleContent,
  CollapsibleRoot,
} from "@/components/ui/collapsible";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useMaxTasksReached from "@/lib/hooks/useMaxTasksReached";
import useTheme from "@/lib/hooks/useTheme";
import projectOptions from "@/lib/options/project.options";
import userPreferencesOptions from "@/lib/options/userPreferences.options";
import { cn } from "@/lib/utils";

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
            <ListTrigger
              title={column.title}
              count={
                project?.columns?.nodes?.find((c) => c?.rowId === column?.rowId)
                  ?.tasks?.totalCount ?? 0
              }
              tooltip={{
                title: "Add Task",
                shortCut: "C",
              }}
              emoji={column.emoji}
              onCreate={(e) => {
                e.preventDefault();
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
            </ListTrigger>

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
                      columnTasks.map((task, index) => {
                        const displayId = `${project?.prefix ?? "PROJ"}-${taskIndex(
                          task.rowId,
                        )}`;

                        return (
                          <ListItem
                            key={task.rowId}
                            task={task}
                            index={index}
                            displayId={displayId}
                          />
                        );
                      })
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
