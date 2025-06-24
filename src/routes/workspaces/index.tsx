import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import Board from "@/components/Board";
import Header from "@/components/Header";
import ListView from "@/components/ListView";
import ProjectOverview from "@/components/ProjectOverview";
import ProjectOverviewSettings from "@/components/ProjectOverviewSettings";
import ProjectSettings from "@/components/ProjectSettings";
import Sidebar from "@/components/Sidebar";
import SidebarToggle from "@/components/SidebarToggle";
import TaskDialog from "@/components/TaskDialog";
// import WorkspaceSettings from "@/components/WorkspaceSettings";
import workspacesOptions from "@/lib/options/workspaces.options";
import seo from "@/utils/seo";

import type { Assignee, Project } from "@/types";

const teamMembers: Assignee[] = [
  { id: "user-1", name: "John Doe" },
  { id: "user-2", name: "Jane Smith" },
  { id: "user-3", name: "Alex Johnson" },
];

const initialProjects: { [key: string]: Project } = {
  runa: {
    id: "runa",
    name: "Runa",
    workspaceId: "personal",
    description:
      "A beautiful Kanban board application for managing projects and tasks efficiently.",
    prefix: "RUNA",
    color: "#0fa968",
    labels: ["bug", "feature", "documentation", "enhancement", "design"],
    team: teamMembers,
    viewMode: "board",
    columns: {
      backlog: {
        id: "backlog",
        title: "Backlog",
        tasks: [
          {
            id: "task-1",
            content: "Create project documentation",
            priority: "high",
            description:
              "Write comprehensive documentation covering project setup, architecture, and deployment.",
            assignees: [teamMembers[0]],
            labels: ["documentation"],
            dueDate: "2024-03-15T23:59:59.999Z",
          },
          {
            id: "task-2",
            content: "Design user interface",
            priority: "medium",
            description:
              "Create wireframes and high-fidelity designs for the main application interface.",
            assignees: [teamMembers[1]],
            labels: ["design"],
            dueDate: "2024-03-20T23:59:59.999Z",
          },
          {
            id: "task-3",
            content: "Set up development environment",
            priority: "low",
            description:
              "Configure development tools, linters, and CI/CD pipeline.",
            assignees: [teamMembers[2]],
            labels: ["enhancement"],
            dueDate: undefined,
          },
        ],
      },
      todo: {
        id: "todo",
        title: "To Do",
        tasks: [
          {
            id: "task-4",
            content: "Implement authentication",
            priority: "high",
            description:
              "Set up user authentication flow with email and password.",
            assignees: [teamMembers[0], teamMembers[1]],
            labels: ["feature"],
            dueDate: "2024-03-25T23:59:59.999Z",
          },
          {
            id: "task-5",
            content: "Create API endpoints",
            priority: "medium",
            description:
              "Design and implement RESTful API endpoints for core functionality.",
            assignees: [teamMembers[2]],
            labels: ["feature"],
            dueDate: undefined,
          },
        ],
      },
      "in-progress": {
        id: "in-progress",
        title: "In Progress",
        tasks: [
          {
            id: "task-6",
            content: "Project setup",
            priority: "low",
            description: "Initial project configuration and dependency setup.",
            assignees: [teamMembers[0]],
            labels: ["enhancement"],
            dueDate: undefined,
          },
        ],
      },
      "awaiting-review": {
        id: "awaiting-review",
        title: "Awaiting Review",
        tasks: [],
      },
      done: {
        id: "done",
        title: "Done",
        tasks: [
          {
            id: "task-7",
            content: "Initial planning",
            priority: "medium",
            description: "Define project scope, timeline, and key milestones.",
            assignees: teamMembers,
            labels: ["documentation"],
            dueDate: "2024-03-01T23:59:59.999Z",
          },
        ],
      },
    },
  },
  analytics: {
    id: "analytics",
    name: "Analytics Dashboard",
    workspaceId: "team",
    description:
      "Real-time analytics dashboard for monitoring key business metrics and performance indicators.",
    prefix: "ANLY",
    color: "#a855f7",
    labels: ["bug", "feature", "performance", "data", "ui"],
    team: teamMembers,
    viewMode: "board",
    columns: {
      backlog: {
        id: "backlog",
        title: "Backlog",
        tasks: [
          {
            id: "task-anly-1",
            content: "Design data visualization components",
            priority: "high",
            description:
              "Create reusable chart components using D3.js for various data visualizations including line charts, bar charts, and heatmaps.",
            assignees: [teamMembers[1]],
            labels: ["ui", "feature"],
            dueDate: "2024-03-25T23:59:59.999Z",
          },
          {
            id: "task-anly-2",
            content: "Implement data filtering system",
            priority: "medium",
            description:
              "Build a flexible filtering system allowing users to slice and dice data across different dimensions.",
            assignees: [teamMembers[2]],
            labels: ["data", "feature"],
            dueDate: undefined,
          },
        ],
      },
      todo: {
        id: "todo",
        title: "To Do",
        tasks: [
          {
            id: "task-anly-3",
            content: "Set up real-time data pipeline",
            priority: "high",
            description:
              "Implement WebSocket connection for real-time data updates and configure data processing pipeline.",
            assignees: [teamMembers[0], teamMembers[2]],
            labels: ["performance", "data"],
            dueDate: "2024-03-30T23:59:59.999Z",
          },
        ],
      },
      "in-progress": {
        id: "in-progress",
        title: "In Progress",
        tasks: [
          {
            id: "task-anly-4",
            content: "Create dashboard layout",
            priority: "medium",
            description:
              "Design and implement responsive grid layout for dashboard widgets with drag-and-drop functionality.",
            assignees: [teamMembers[1]],
            labels: ["ui"],
            dueDate: undefined,
          },
        ],
      },
      "awaiting-review": {
        id: "awaiting-review",
        title: "Awaiting Review",
        tasks: [],
      },
      done: {
        id: "done",
        title: "Done",
        tasks: [
          {
            id: "task-anly-5",
            content: "Project requirements gathering",
            priority: "high",
            description:
              "Collect and document requirements from stakeholders for the analytics dashboard.",
            assignees: teamMembers,
            labels: ["documentation"],
            dueDate: "2024-03-10T23:59:59.999Z",
          },
        ],
      },
    },
  },
  marketing: {
    id: "marketing",
    name: "Marketing Website",
    workspaceId: "team",
    description:
      "Company marketing website showcasing our products, services, and brand identity.",
    prefix: "MKTG",
    color: "#f43f5e",
    labels: ["bug", "feature", "content", "seo", "design"],
    team: teamMembers,
    viewMode: "board",
    columns: {
      backlog: {
        id: "backlog",
        title: "Backlog",
        tasks: [
          {
            id: "task-mktg-1",
            content: "Implement blog section",
            priority: "medium",
            description:
              "Create a blog section with categories, tags, and search functionality.",
            assignees: [teamMembers[2]],
            labels: ["feature", "content"],
            dueDate: undefined,
          },
        ],
      },
      todo: {
        id: "todo",
        title: "To Do",
        tasks: [
          {
            id: "task-mktg-2",
            content: "Design product showcase",
            priority: "high",
            description:
              "Create interactive product showcase with features, pricing, and comparison tables.",
            assignees: [teamMembers[1]],
            labels: ["design", "content"],
            dueDate: "2024-03-28T23:59:59.999Z",
          },
          {
            id: "task-mktg-3",
            content: "Optimize SEO",
            priority: "medium",
            description:
              "Implement SEO best practices including meta tags, sitemap, and structured data.",
            assignees: [teamMembers[0]],
            labels: ["seo"],
            dueDate: undefined,
          },
        ],
      },
      "in-progress": {
        id: "in-progress",
        title: "In Progress",
        tasks: [
          {
            id: "task-mktg-4",
            content: "Homepage redesign",
            priority: "high",
            description:
              "Redesign homepage with new brand identity and improved user experience.",
            assignees: [teamMembers[1], teamMembers[2]],
            labels: ["design"],
            dueDate: "2024-03-20T23:59:59.999Z",
          },
        ],
      },
      "awaiting-review": {
        id: "awaiting-review",
        title: "Awaiting Review",
        tasks: [
          {
            id: "task-mktg-5",
            content: "Contact form implementation",
            priority: "low",
            description:
              "Create contact form with validation and email notification system.",
            assignees: [teamMembers[0]],
            labels: ["feature"],
            dueDate: undefined,
          },
        ],
      },
      done: {
        id: "done",
        title: "Done",
        tasks: [
          {
            id: "task-mktg-6",
            content: "Design system setup",
            priority: "high",
            description:
              "Set up design system with color palette, typography, and component library.",
            assignees: [teamMembers[1]],
            labels: ["design"],
            dueDate: "2024-03-05T23:59:59.999Z",
          },
        ],
      },
    },
  },
};

export const Route = createFileRoute({
  head: () => ({
    meta: [...seo({ title: "Workspaces" })],
  }),
  component: Workspaces,
  loader: async ({ context }) =>
    await context.queryClient.ensureQueryData(workspacesOptions),
});

function Workspaces() {
  const navigate = useNavigate();

  // TODO: determine why this is still showing data as possibly being undefined
  const { data: workspaces } = useSuspenseQuery({
    ...workspacesOptions,
    select: (data) => data?.workspaces?.nodes,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState(
    workspaces?.[0]?.rowId,
  );
  const [projects, setProjects] = useState(initialProjects);
  const [currentProject, setCurrentProject] = useState("runa");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWorkspaceSettingsOpen, setIsWorkspaceSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});

  const currentProjectData = projects[currentProject];

  useEffect(() => {
    if (currentProjectData) {
      setExpandedSections(
        Object.keys(currentProjectData.columns).reduce(
          (acc, columnId) => {
            acc[columnId] = true;
            return acc;
          },
          {} as { [key: string]: boolean },
        ),
      );
    }
  }, [currentProjectData]);

  const handleImportProject = () => {
    // Implementation needed
  };

  const handleExportProject = () => {
    // Implementation needed
  };

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

  const toggleSection = (columnId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const getTaskById = (taskId: string) => {
    for (const column of Object.values(currentProjectData.columns)) {
      const task = column.tasks.find((t) => t.id === taskId);
      if (task) return task;
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportProject}
        className="hidden"
      />

      <div
        className={`relative flex-shrink-0 ${isSidebarCollapsed ? "w-0" : "w-60"}`}
      >
        <div
          className={`absolute inset-0 ${isSidebarCollapsed ? "pointer-events-none opacity-0" : "opacity-100"}`}
        >
          <Sidebar
            currentWorkspace={currentWorkspace ?? "personal"}
            projects={undefined}
            currentProject={currentProject}
            onOpenWorkspaceSettings={() => setIsWorkspaceSettingsOpen(true)}
            onSignOut={() => navigate({ to: "/" })}
          />
        </div>
      </div>

      <SidebarToggle
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col">
          {currentProjectData && (
            <Header
              project={currentProjectData}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onViewModeChange={
                (viewMode) => console.warn("TODO: View Mode Change", viewMode)
                // handleProjectUpdate(currentProject, { viewMode })
              }
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          <div className="flex-1">
            {currentProjectData &&
              (currentProject === "projects" ? (
                <ProjectOverview
                  project={currentProjectData}
                  searchQuery={searchQuery}
                  expandedSections={expandedSections}
                  onToggleSection={toggleSection}
                  onTaskClick={setSelectedTask}
                  onProjectUpdate={(updatedColumns) => {
                    setProjects({
                      ...projects,
                      [currentProject]: {
                        ...currentProjectData,
                        columns: updatedColumns,
                      },
                    });
                  }}
                />
              ) : currentProjectData.viewMode === "board" ? (
                <div className="h-full">
                  <Board
                    project={filterTasks(currentProjectData)}
                    onProjectUpdate={(updatedColumns) => {
                      setProjects({
                        ...projects,
                        [currentProject]: {
                          ...currentProjectData,
                          columns: updatedColumns,
                        },
                      });
                    }}
                    isProjectView={false}
                  />
                </div>
              ) : (
                <ListView
                  project={filterTasks(currentProjectData)}
                  expandedSections={expandedSections}
                  onToggleSection={toggleSection}
                  onTaskClick={setSelectedTask}
                  searchQuery={searchQuery}
                  onProjectUpdate={(updatedColumns) => {
                    setProjects({
                      ...projects,
                      [currentProject]: {
                        ...currentProjectData,
                        columns: updatedColumns,
                      },
                    });
                  }}
                />
              ))}
          </div>
        </div>
      </main>

      {isSettingsOpen &&
        (currentProject === "projects" ? (
          <ProjectOverviewSettings
            project={currentProjectData}
            onClose={() => setIsSettingsOpen(false)}
            onUpdate={(updates) => {
              console.warn("TODO Project Overview Settings Updated:", updates);
              // handleProjectUpdate(currentProject, updates);
            }}
          />
        ) : (
          <ProjectSettings
            project={currentProjectData}
            onClose={() => setIsSettingsOpen(false)}
            onUpdate={(updates) => {
              console.warn("TODO Project Settings Updated:", updates);
              // handleProjectUpdate(currentProject, updates);
            }}
            onImport={() => fileInputRef.current?.click()}
            onExport={handleExportProject}
          />
        ))}

      {/* TODO */}
      {/* {isWorkspaceSettingsOpen && (
        <WorkspaceSettings
          team={workspaces.find((w) => w.id === currentWorkspace)?.team || []}
          onClose={() => setIsWorkspaceSettingsOpen(false)}
          onUpdate={handleTeamUpdate}
        />
      )} */}

      {selectedTask && (
        <TaskDialog
          task={getTaskById(selectedTask)!}
          projects={Object.values(projects)}
          tasks={Object.values(projects)
            .flatMap((p) => Object.values(p.columns))
            .flatMap((c) => c.tasks)}
          team={currentProjectData.team}
          isProject={currentProject === "projects"}
          projectPrefix={currentProjectData.prefix}
          currentProject={currentProjectData}
          onClose={() => setSelectedTask(null)}
          // TODO
          // onDelete={(taskId) => {
          //   for (const columnId in currentProjectData.columns) {
          //     const column = currentProjectData.columns[columnId];
          //     if (column.tasks.some((t) => t.id === taskId)) {
          //       handleDeleteTask(columnId, taskId);
          //       break;
          //     }
          //   }
          // }}
          // onUpdate={handleUpdateTask}
        />
      )}
    </div>
  );
}
