import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";

import ColumnHeader from "@/components/shared/ColumnHeader";
import BoardItem from "@/components/workspaces/overview/BoardItem";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useProjectStore from "@/lib/hooks/store/useProjectStore";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import { cn } from "@/lib/utils";

import type { ProjectFragment } from "@/generated/graphql";

interface Props {
  projects: ProjectFragment[];
}

const Board = ({ projects }: Props) => {
  const navigate = useNavigate();
  const { workspaceSlug } = useParams({
    from: "/_auth/workspaces/$workspaceSlug/projects/",
  });

  const { workspaceId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/",
  });
  const { search } = useSearch({
    from: "/_auth/workspaces/$workspaceSlug/projects/",
  });

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
                  shortCut: "P",
                }}
                emoji={column.emoji}
                onCreate={() => {
                  setProjectColumnId(column.rowId);
                  setIsCreateProjectDialogOpen(true);
                }}
              />

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
