import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useRouteContext,
  useSearch,
} from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { ColumnHeader } from "@/components/core";
import { Role } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useDragStore from "@/lib/hooks/store/useDragStore";
import useProjectStore from "@/lib/hooks/store/useProjectStore";
import useMaxProjectsReached from "@/lib/hooks/useMaxProjectsReached";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import workspaceOptions from "@/lib/options/workspace.options";
import { cn } from "@/lib/utils";
import BoardItem from "./OverviewBoardItem";

import type { MouseEvent as ReactMouseEvent } from "react";
import type { ProjectFragment } from "@/generated/graphql";

interface Props {
  projects: ProjectFragment[];
}

const EDGE_THRESHOLD = 150;
const MAX_SCROLL_SPEED = 25;

const Board = ({ projects }: Props) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isDragging } = useDragStore();

  // Drag-to-scroll state
  const [isMouseDragging, setIsMouseDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  // Auto-scroll during card drag
  useEffect(() => {
    if (!isDragging) return;

    let animationFrameId: number;
    let scrollSpeed = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX;

      if (mouseX < rect.left + EDGE_THRESHOLD) {
        const distanceFromEdge = mouseX - rect.left;
        const intensity = 1 - distanceFromEdge / EDGE_THRESHOLD;
        scrollSpeed = -MAX_SCROLL_SPEED * intensity ** 2;
      } else if (mouseX > rect.right - EDGE_THRESHOLD) {
        const distanceFromEdge = rect.right - mouseX;
        const intensity = 1 - distanceFromEdge / EDGE_THRESHOLD;
        scrollSpeed = MAX_SCROLL_SPEED * intensity ** 2;
      } else {
        scrollSpeed = 0;
      }
    };

    const scrollStep = () => {
      const container = scrollContainerRef.current;
      if (container && scrollSpeed !== 0) {
        container.scrollLeft += scrollSpeed;
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    document.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(scrollStep);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDragging]);

  // Drag-to-scroll handlers
  const handleMouseDown = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-rfd-draggable-id]")) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    setIsMouseDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeftStart(container.scrollLeft);
    container.style.cursor = "grabbing";
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsMouseDragging(false);
    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = "grab";
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (!isMouseDragging) return;
      e.preventDefault();

      const container = scrollContainerRef.current;
      if (!container) return;

      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeftStart - walk;
    },
    [isMouseDragging, startX, scrollLeftStart],
  );

  const handleMouseLeave = useCallback(() => {
    if (isMouseDragging) {
      setIsMouseDragging(false);
      const container = scrollContainerRef.current;
      if (container) {
        container.style.cursor = "grab";
      }
    }
  }, [isMouseDragging]);
  const { workspaceSlug } = useParams({
    from: "/_auth/workspaces/$workspaceSlug/projects/",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/",
  });

  const { workspaceId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/",
  });
  const { search } = useSearch({
    from: "/_auth/workspaces/$workspaceSlug/projects/",
  });

  const { data: role } = useSuspenseQuery({
    ...workspaceOptions({ rowId: workspaceId, userId: session?.user?.rowId! }),
    select: (data) => data.workspace?.workspaceUsers.nodes?.[0]?.role,
  });

  const isMember = role === Role.Member;

  const maxProjectsReached = useMaxProjectsReached();

  const { data: projectColumns } = useSuspenseQuery({
    ...projectColumnsOptions({ workspaceId: workspaceId!, search }),
    select: (data) => data?.projectColumns?.nodes,
  });

  const { setProjectColumnId } = useProjectStore();
  const { setIsOpen: setIsCreateProjectDialogOpen } = useDialogStore({
    type: DialogType.CreateProject,
  });

  return (
    <div
      ref={scrollContainerRef}
      className="custom-scrollbar h-full cursor-grab select-none overflow-x-auto bg-primary-100/30 p-4 dark:bg-primary-950/20"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="h-full min-w-fit">
        <div className="flex h-full gap-3">
          {projectColumns?.map((column) => (
            <div
              key={column.rowId}
              className="relative flex h-full w-80 flex-col gap-2 bg-inherit"
            >
              <ColumnHeader
                title={column.title}
                count={column.projects.totalCount}
                tooltip={{
                  title: maxProjectsReached
                    ? "Upgrade workspace to create more projects"
                    : "Create Project",
                  shortcut: !maxProjectsReached ? "P" : undefined,
                }}
                emoji={column.emoji}
                onCreate={() => {
                  setProjectColumnId(column.rowId);
                  setIsCreateProjectDialogOpen(true);
                }}
                className={cn(
                  "hidden disabled:pointer-events-auto disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent",
                  !isMember && "inline-flex",
                )}
                disabled={maxProjectsReached}
              />

              <div className="flex h-full overflow-hidden">
                <Droppable droppableId={column.rowId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "flex flex-1 flex-col rounded-xl",
                        snapshot.isDraggingOver &&
                          "bg-primary-100/40 dark:bg-primary-950/40",
                      )}
                    >
                      <div className="no-scrollbar flex h-full flex-col gap-2 overflow-y-auto p-1">
                        {projects
                          .filter(
                            (project) =>
                              project.projectColumnId === column.rowId,
                          )
                          .map((project, index) => (
                            <Draggable
                              key={project.rowId}
                              draggableId={project.rowId}
                              index={index}
                              isDragDisabled={isMember}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="rounded-lg outline-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                  onKeyDown={(evt) => {
                                    if (evt.key === "Enter") {
                                      navigate({
                                        to: "/workspaces/$workspaceSlug/projects/$projectSlug",
                                        params: {
                                          workspaceSlug,
                                          projectSlug: project.slug,
                                        },
                                      });
                                    }
                                  }}
                                >
                                  <BoardItem project={project} />
                                </div>
                              )}
                            </Draggable>
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
