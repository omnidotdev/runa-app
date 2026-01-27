import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useSearch } from "@tanstack/react-router";

import { ColumnTrigger } from "@/components/core";
import {
  CollapsibleContent,
  CollapsibleRoot,
} from "@/components/ui/collapsible";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useProjectStore from "@/lib/hooks/store/useProjectStore";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import useMaxProjectsReached from "@/lib/hooks/useMaxProjectsReached";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import { Role } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import ListItem from "./OverviewListItem";

import type { ProjectsQuery } from "@/generated/graphql";

type ProjectWithPreferences = NonNullable<
  ProjectsQuery["projects"]
>["nodes"][number];

interface Props {
  projects: ProjectWithPreferences[];
}

const List = ({ projects }: Props) => {
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

  const { data: projectColumns } = useQuery({
    ...projectColumnsOptions({ organizationId, search }),
    select: (data) => data?.projectColumns?.nodes,
  });

  const columnProjects = (columnId: string) =>
    projects.filter((project) => project.projectColumnId === columnId);

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
          <ColumnTrigger
            title={column.title}
            count={column.projects.totalCount}
            tooltip={{
              title: maxProjectsReached
                ? "Upgrade workspace to create more projects"
                : "Create Project",
              shortcut: !maxProjectsReached ? "P" : undefined,
            }}
            icon={column.icon}
            onCreate={(e) => {
              e.preventDefault();
              setProjectColumnId(column.rowId);
              setIsCreateProjectDialogOpen(true);
            }}
            className={cn(
              "hidden disabled:pointer-events-auto disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent",
              !isMember && "inline-flex",
            )}
            disabled={maxProjectsReached}
          />

          <CollapsibleContent className="rounded-b-lg p-0">
            {/* NB: Fade in the top border to avoid clashing with the parent border during animation */}
            <div className="border-t transition-opacity ease-in-out" />
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
                  {columnProjects(column.rowId).length === 0 ? (
                    <p
                      className={cn(
                        "ml-2 p-2 text-muted-foreground text-xs",
                        snapshot.isDraggingOver && "hidden",
                      )}
                    >
                      No projects
                    </p>
                  ) : (
                    columnProjects(column.rowId).map((project, index) => (
                      <Draggable
                        key={project.rowId}
                        draggableId={project.rowId}
                        index={index}
                        isDragDisabled={isMember}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "group cursor-pointer bg-background outline-hidden last:rounded-b-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
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
