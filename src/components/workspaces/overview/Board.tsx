import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearch } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarMenuShortcut } from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import BoardItem from "@/components/workspaces/overview/BoardItem";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useDragStore from "@/lib/hooks/store/useDragStore";
import useProjectStore from "@/lib/hooks/store/useProjectStore";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import { cn } from "@/lib/utils";

import type { ProjectFragment as Project } from "@/generated/graphql";

const Board = () => {
  const { workspaceId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/",
  });

  const { search } = useSearch({
    from: "/_auth/workspaces/$workspaceId/projects/",
  });

  const { data: projectColumns } = useQuery({
    ...projectColumnsOptions({ workspaceId: workspaceId!, search }),
    select: (data) => data?.projectColumns?.nodes,
  });

  const { draggableId } = useDragStore();

  const { setProjectColumnId } = useProjectStore();
  const { setIsOpen: setIsCreateProjectDialogOpen } = useDialogStore({
    type: DialogType.CreateProject,
  });

  return (
    <div className="no-scrollbar h-full select-none overflow-x-auto bg-primary-100/30 dark:bg-primary-950/20">
      <div className="h-full min-w-fit p-4">
        <div className="flex h-full gap-3">
          {projectColumns?.map((column) => (
            <div
              key={column.rowId}
              className="relative flex h-full w-80 flex-col gap-2 bg-inherit"
            >
              <div className="z-10 mb-1 flex items-center justify-between rounded-lg border bg-background px-3 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <span>{column.emoji ?? "😀"}</span>
                  <h3 className="font-semibold text-base-800 text-sm dark:text-base-100">
                    {column.title}
                  </h3>
                  <span className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground text-xs tabular-nums">
                    {column.projects.totalCount}
                  </span>
                </div>

                <Tooltip
                  positioning={{ placement: "top", gutter: 11 }}
                  tooltip={{
                    className: "bg-background text-foreground border",
                    children: (
                      <div className="inline-flex">
                        Create Project
                        <div className="ml-2 flex items-center gap-0.5">
                          <SidebarMenuShortcut>P</SidebarMenuShortcut>
                        </div>
                      </div>
                    ),
                  }}
                >
                  <Button
                    variant="ghost"
                    size="xs"
                    className="size-5"
                    onClick={() => {
                      setProjectColumnId(column.rowId);
                      setIsCreateProjectDialogOpen(true);
                    }}
                  >
                    <Plus className="size-4" />
                  </Button>
                </Tooltip>
              </div>

              <div className="no-scrollbar flex h-full overflow-y-auto">
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
                    >
                      {column.projects.nodes
                        .filter((project) => project.rowId !== draggableId)
                        .map((project, index) => (
                          <Draggable
                            key={project.rowId}
                            draggableId={project.rowId}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="my-1"
                              >
                                <BoardItem project={project as Project} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
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
