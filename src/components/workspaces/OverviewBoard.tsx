import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useRouteContext,
  useSearch,
} from "@tanstack/react-router";

import { ColumnHeader } from "@/components/core";
import { Role } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useProjectStore from "@/lib/hooks/store/useProjectStore";
import useMaxProjectsReached from "@/lib/hooks/useMaxProjectsReached";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import workspaceOptions from "@/lib/options/workspace.options";
import { cn } from "@/lib/utils";
import BoardItem from "./OverviewBoardItem";

import type { ProjectFragment } from "@/generated/graphql";

interface Props {
  projects: ProjectFragment[];
}

const Board = ({ projects }: Props) => {
  const navigate = useNavigate();
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
    <div className="custom-scrollbar h-full select-none overflow-x-auto bg-primary-100/30 p-4 dark:bg-primary-950/20">
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
                  title: "Create Project",
                  shortcut: "P",
                }}
                emoji={column.emoji}
                onCreate={() => {
                  setProjectColumnId(column.rowId);
                  setIsCreateProjectDialogOpen(true);
                }}
                className={cn("hidden", !isMember && "inline-flex")}
                // TODO: update tooltip to handle disabled state
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
