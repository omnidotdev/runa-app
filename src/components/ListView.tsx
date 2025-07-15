import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { ChevronDownIcon, PlusIcon } from "lucide-react";

import { columnIcons } from "@/components/Tasks";
import TasksList from "@/components/TasksList";
import { Button } from "@/components/ui/button";
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SidebarMenuShotcut } from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import useReorderTasks from "@/lib/hooks/useReorderTasks";
import projectOptions from "@/lib/options/project.options";
import { useTheme } from "@/providers/ThemeProvider";

import type { Dispatch, SetStateAction } from "react";

interface Props {
  openStates: boolean[];
  setOpenStates: Dispatch<SetStateAction<boolean[]>>;
  setIsForceClosed: (value: boolean) => void;
}

const ListView = ({ openStates, setOpenStates, setIsForceClosed }: Props) => {
  const { theme } = useTheme();

  const { projectId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });

  const { setIsOpen: setIsCreateTaskDialogOpen } = useDialogStore({
    type: DialogType.CreateTask,
  });

  const { setColumnId } = useTaskStore();

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const { onDragEnd } = useReorderTasks();

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
                    <div className="flex-shrink-0">
                      {
                        columnIcons[
                          column?.title
                            .toLowerCase()
                            .replace(/ /g, "-") as keyof typeof columnIcons
                        ]
                      }
                    </div>

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

                  <div className="ml-auto flex gap-2">
                    <Tooltip
                      positioning={{ placement: "top", gutter: 11 }}
                      tooltip={{
                        className: "bg-background text-foreground border",
                        children: (
                          <div className="inline-flex">
                            Add Task
                            <div className="ml-2 flex items-center gap-0.5">
                              <SidebarMenuShotcut>C</SidebarMenuShotcut>
                            </div>
                          </div>
                        ),
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="xs"
                        className="size-5"
                        onClick={(e) => {
                          e.preventDefault();
                          setColumnId(column.rowId);
                          setIsCreateTaskDialogOpen(true);
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
                    <TasksList
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      prefix={project?.prefix ?? "PROJ"}
                      columnId={column.rowId}
                      isDraggingOver={snapshot.isDraggingOver}
                      style={{
                        backgroundColor:
                          project?.color && snapshot.isDraggingOver
                            ? `${project?.color}0D`
                            : undefined,
                      }}
                    >
                      {provided.placeholder}
                    </TasksList>
                  )}
                </Droppable>
              </CollapsibleContent>
            </CollapsibleRoot>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default ListView;
