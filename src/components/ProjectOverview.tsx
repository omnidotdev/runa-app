import Board from "@/components/Board";
import ListView from "@/components/ListView";

import type { Project } from "@/types";

interface ProjectOverviewProps {
  project: Project;
  searchQuery: string;
  expandedSections: { [key: string]: boolean };
  onToggleSection: (columnId: string) => void;
  onTaskClick: (taskId: string) => void;
  onProjectUpdate: (columns: Project["columns"]) => void;
}

const ProjectOverview = ({
  project,
  searchQuery,
  expandedSections,
  onToggleSection,
  onTaskClick,
  onProjectUpdate,
}: ProjectOverviewProps) => {
  const filterTasks = (project: Project) => {
    if (!searchQuery) return project;

    const filteredColumns = Object.entries(project.columns).reduce(
      (acc, [columnId, column]) => {
        acc[columnId] = {
          ...column,
          tasks: column.tasks.filter(
            (task) =>
              task.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
              task.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
          ),
        };
        return acc;
      },
      {} as Project["columns"],
    );

    return { ...project, columns: filteredColumns };
  };

  return project.viewMode === "board" ? (
    <Board
      project={filterTasks(project)}
      onProjectUpdate={onProjectUpdate}
      isProjectView={true}
    />
  ) : (
    <ListView
      project={filterTasks(project)}
      expandedSections={expandedSections}
      onToggleSection={onToggleSection}
      onTaskClick={onTaskClick}
      onProjectUpdate={onProjectUpdate}
      searchQuery={searchQuery}
    />
  );
};

export default ProjectOverview;
