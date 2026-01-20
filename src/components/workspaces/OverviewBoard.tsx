import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";

import { ColumnHeader } from "@/components/core";
import {
  boardColumnStyles,
  boardContainerStyles,
  boardLayoutStyles,
} from "@/lib/board/styles";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useDragStore from "@/lib/hooks/store/useDragStore";
import useProjectStore from "@/lib/hooks/store/useProjectStore";
import useAutoScrollOnDrag from "@/lib/hooks/useAutoScrollOnDrag";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import useInertialScroll from "@/lib/hooks/useInertialScroll";
import useMaxProjectsReached from "@/lib/hooks/useMaxProjectsReached";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import { Role } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import BoardItem from "./OverviewBoardItem";

import type { ProjectsQuery } from "@/generated/graphql";

type ProjectWithPreferences = NonNullable<
  ProjectsQuery["projects"]
>["nodes"][number];

interface Props {
  projects: ProjectWithPreferences[];
}

const Board = ({ projects }: Props) => {
  const navigate = useNavigate();
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
  const { workspaceSlug } = useParams({
    from: "/_auth/workspaces/$workspaceSlug/projects/",
  });

  const { organizationId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/",
  });
  const { search } = useSearch({
    from: "/_auth/workspaces/$workspaceSlug/projects/",
  });

  // Get role from IDP organization claims
  const role = useCurrentUserRole(organizationId);
  const isMember = role === Role.Member;

  const maxProjectsReached = useMaxProjectsReached();

  const { data: projectColumns } = useSuspenseQuery({
    ...projectColumnsOptions({ organizationId, search }),
    select: (data) => data?.projectColumns?.nodes,
  });

  const { setProjectColumnId } = useProjectStore();
  const { setIsOpen: setIsCreateProjectDialogOpen } = useDialogStore({
    type: DialogType.CreateProject,
  });

  return (
    <div
      ref={scrollContainerRef}
      className={cn(boardContainerStyles.base, boardContainerStyles.background)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={boardLayoutStyles.innerPadding}>
        <div className={boardLayoutStyles.columnsGap}>
          {projectColumns?.map((column) => (
            <div key={column.rowId} className={boardColumnStyles.wrapper}>
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
                        boardColumnStyles.droppable,
                        snapshot.isDraggingOver &&
                          boardColumnStyles.droppableActive,
                      )}
                    >
                      <div
                        className={cn(
                          boardColumnStyles.itemsContainer,
                          "gap-2",
                        )}
                      >
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
