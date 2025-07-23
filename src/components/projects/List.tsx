import { Droppable } from "@hello-pangea/dnd";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";
import { ChevronDownIcon, PlusIcon } from "lucide-react";

import ListItem from "@/components/projects/ListItem";
import { Button } from "@/components/ui/button";
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SidebarMenuShortcut } from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
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
      hiddenColumns: userPreferences?.hiddenColumnIds as string[],
    }),
    select: (data) => data?.project,
  });

  const taskIndex = (taskId: string) =>
    project?.columns?.nodes
      ?.flatMap((column) => column?.tasks?.nodes?.map((task) => task))
      .sort(
        (a, b) =>
          new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime(),
      )
      .map((task) => task?.rowId)
      .indexOf(taskId);

  return (
    <div
      className="custom-scrollbar h-full overflow-y-auto bg-primary-100/30 p-4 dark:bg-primary-950/20"
      style={{
        backgroundColor: project?.color
          ? theme === "dark"
            ? `${project?.color}12`
            : `${project?.color}0D`
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
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-xs">{column.emoji ?? "😀"}</p>

                  <h3 className="text-base-800 text-sm dark:text-base-100">
                    {column?.title}
                  </h3>

                  <span className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground text-xs tabular-nums">
                    {
                      project?.columns?.nodes?.find(
                        (c) => c?.rowId === column?.rowId,
                      )?.tasks?.totalCount
                    }
                  </span>
                </div>

                <div className="ml-auto flex items-center gap-1">
                  <Tooltip
                    positioning={{ placement: "top", gutter: 11 }}
                    tooltip={{
                      className: "bg-background text-foreground border",
                      children: (
                        <div className="inline-flex">
                          Add Task
                          <div className="ml-2 flex items-center gap-0.5">
                            <SidebarMenuShortcut>C</SidebarMenuShortcut>
                          </div>
                        </div>
                      ),
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.preventDefault();
                        setColumnId(column.rowId);
                        navigate({
                          search: (prev) => ({
                            ...prev,
                            createTask: true,
                          }),
                        });
                      }}
                    >
                      <PlusIcon className="size-4" />
                    </Button>
                  </Tooltip>
                </div>

                <ChevronDownIcon className="ml-2 size-4 text-base-400 transition-transform" />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="border-t">
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
                        project?.color && snapshot.isDraggingOver
                          ? `${project?.color}0D`
                          : undefined,
                    }}
                  >
                    {columnTasks?.length === 0 ? (
                      <p
                        className={cn(
                          "ml-2 p-2 text-muted-foreground text-xs",
                          snapshot.isDraggingOver && "hidden",
                        )}
                      >
                        No tasks
                      </p>
                    ) : (
                      columnTasks.map((task, index) => {
                        const displayId = `${project?.prefix ?? "PROJ"}-${
                          taskIndex(task.rowId) ? taskIndex(task.rowId) : 0
                        }`;

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
