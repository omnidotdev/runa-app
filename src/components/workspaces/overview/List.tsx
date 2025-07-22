import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useSearch } from "@tanstack/react-router";
import { ChevronDownIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SidebarMenuShortcut } from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import ListItem from "@/components/workspaces/overview/ListItem";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useDragStore from "@/lib/hooks/store/useDragStore";
import useProjectStore from "@/lib/hooks/store/useProjectStore";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import { cn } from "@/lib/utils";

const List = () => {
  const { workspaceId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/",
  });

  const { search } = useSearch({
    from: "/_auth/workspaces/$workspaceSlug/projects/",
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
    <div className="custom-scrollbar h-full overflow-y-auto bg-primary-100/30 p-4 dark:bg-primary-950/20">
      {projectColumns?.map((column) => (
        <CollapsibleRoot
          key={column.rowId}
          className="mb-4 rounded-lg border bg-background last:mb-0"
          defaultOpen
        >
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{column.emoji ?? "😀"}</span>
                <h3 className="font-semibold text-base-800 text-sm dark:text-base-100">
                  {column.title}
                </h3>
                <span className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground text-xs tabular-nums">
                  {column.projects.totalCount}
                </span>
              </div>

              <div className="ml-auto flex gap-2">
                <Tooltip
                  positioning={{ placement: "top", gutter: 11 }}
                  tooltip={{
                    className: "bg-background text-foreground border",
                    children: (
                      <div className="inline-flex">
                        Add Project
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
                    onClick={(e) => {
                      e.preventDefault();
                      setProjectColumnId(column.rowId);
                      setIsCreateProjectDialogOpen(true);
                    }}
                  >
                    <PlusIcon className="size-4" />
                  </Button>
                </Tooltip>
              </div>

              <ChevronDownIcon className="ml-2 size-4 transition-transform" />
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="border-t">
            <Droppable droppableId={column.rowId}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "flex min-h-px flex-1 flex-col divide-y divide-base-200 overflow-hidden rounded-b-lg bg-background/40 dark:divide-base-700",
                    snapshot.isDraggingOver &&
                      "bg-primary-100/40 dark:bg-primary-950/40",
                  )}
                >
                  {column.projects.nodes.length === 0 ? (
                    <p
                      className={cn(
                        "ml-2 p-2 text-muted-foreground text-xs",
                        snapshot.isDraggingOver && "hidden",
                      )}
                    >
                      No projects
                    </p>
                  ) : (
                    column.projects.nodes
                      .filter((project) => project.rowId !== draggableId)
                      .map((project, index) => (
                        <Draggable
                          key={project.rowId}
                          draggableId={project.rowId}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "group cursor-pointer bg-background",
                                snapshot.isDragging
                                  ? "z-10 shadow-lg"
                                  : "hover:bg-base-50/50 dark:hover:bg-background/90",
                              )}
                            >
                              <ListItem project={project} />
                            </div>
                          )}
                        </Draggable>
                      ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </CollapsibleContent>
        </CollapsibleRoot>
      ))}
    </div>
  );
};

export default List;
