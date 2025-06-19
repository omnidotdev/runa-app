"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Board } from "@/components/Board";
import { Header } from "@/components/Header";
import { ListView } from "@/components/ListView";
import { ProjectOverview } from "@/components/ProjectOverview";
import { ProjectOverviewSettings } from "@/components/ProjectOverviewSettings";
import { ProjectSettings } from "@/components/ProjectSettings";
import { Sidebar } from "@/components/Sidebar";
import { SidebarToggle } from "@/components/SidebarToggle";
import { TaskDialog } from "@/components/TaskDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WorkspaceSettings } from "@/components/WorkspaceSettings";

import type { Assignee, Project, Task, Workspace } from "@/types";

const teamMembers: Assignee[] = [
  { id: "user-1", name: "John Doe" },
  { id: "user-2", name: "Jane Smith" },
  { id: "user-3", name: "Alex Johnson" },
];

const defaultColumns = {
  backlog: {
    id: "backlog",
    title: "Backlog",
    tasks: [],
  },
  todo: {
    id: "todo",
    title: "To Do",
    tasks: [],
  },
  "in-progress": {
    id: "in-progress",
    title: "In Progress",
    tasks: [],
  },
  "awaiting-review": {
    id: "awaiting-review",
    title: "Awaiting Review",
    tasks: [],
  },
  done: {
    id: "done",
    title: "Done",
    tasks: [],
  },
};

const initialWorkspaces: Workspace[] = [
  {
    id: "personal",
    name: "Personal",
    team: teamMembers,
  },
  {
    id: "team",
    name: "Team",
    team: teamMembers,
  },
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

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [currentWorkspace, setCurrentWorkspace] = useState("personal");
  const [projects, setProjects] = useState(initialProjects);
  const [currentProject, setCurrentProject] = useState("runa");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWorkspaceSettingsOpen, setIsWorkspaceSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});

  const projectsOverview = useMemo(() => {
    const workspaceProjects = Object.values(projects).filter(
      (p) => p.workspaceId === currentWorkspace,
    );

    return {
      id: `projects-${currentWorkspace}`,
      name: "Projects Overview",
      workspaceId: currentWorkspace,
      description:
        "Overview of all active and planned projects in this workspace.",
      team: workspaces.find((w) => w.id === currentWorkspace)?.team || [],
      viewMode: "board",
      columns: {
        planned: {
          id: "planned",
          title: "Planned",
          tasks: workspaceProjects
            .filter((p) => !p.id.startsWith("projects-"))
            .map((p) => ({
              id: p.id,
              content: p.name,
              priority: "medium",
              description: p.description || "",
              assignees: [],
              dueDate: undefined,
            })),
        },
        "in-progress": {
          id: "in-progress",
          title: "In Progress",
          tasks: [],
        },
        completed: {
          id: "completed",
          title: "Completed",
          tasks: [],
        },
      },
    };
  }, [currentWorkspace, projects, workspaces]);

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

  const handleWorkspaceCreate = (workspace: Workspace) => {
    setWorkspaces((prev) => [...prev, workspace]);
    setCurrentWorkspace(workspace.id);
    setCurrentProject(`projects-${workspace.id}`);
  };

  const handleWorkspaceDelete = (workspaceId: string) => {
    setWorkspaces((prev) => prev.filter((w) => w.id !== workspaceId));

    setProjects((prev) => {
      const newProjects = { ...prev };
      Object.keys(newProjects).forEach((projectId) => {
        if (newProjects[projectId].workspaceId === workspaceId) {
          delete newProjects[projectId];
        }
      });
      return newProjects;
    });

    if (currentWorkspace === workspaceId) {
      const firstWorkspace = workspaces.find((w) => w.id !== workspaceId);
      if (firstWorkspace) {
        setCurrentWorkspace(firstWorkspace.id);
        setCurrentProject(`projects-${firstWorkspace.id}`);
      }
    }
  };

  const handleProjectCreate = (project: Project) => {
    setProjects((prev) => ({
      ...prev,
      [project.id]: {
        ...project,
        workspaceId: currentWorkspace,
        team: workspaces.find((w) => w.id === currentWorkspace)?.team || [],
        viewMode: "board",
        columns: { ...defaultColumns },
      },
    }));
  };

  const handleProjectDelete = (projectId: string) => {
    setProjects((prev) => {
      const { [projectId]: deleted, ...rest } = prev;

      // If we're deleting a project, update the overview
      if (projectId === `projects-${currentWorkspace}`) {
        return rest;
      }

      return rest;
    });

    if (currentProject === projectId) {
      const firstProject = Object.values(projects).find(
        (p) => p.id !== projectId && p.workspaceId === currentWorkspace,
      );
      if (firstProject) {
        setCurrentProject(firstProject.id);
      }
    }
  };

  const handleProjectUpdate = (
    projectId: string,
    updates: Partial<Project>,
  ) => {
    setProjects((prev) => {
      const newProjects = {
        ...prev,
        [projectId]: {
          ...prev[projectId],
          ...updates,
        },
      };

      // If we're updating columns in the projects overview
      if (projectId === `projects-${currentWorkspace}` && updates.columns) {
        // Ensure tasks are preserved when columns are updated
        const allTasks = Object.values(prev[projectId].columns).flatMap(
          (column) => column.tasks,
        );

        // Redistribute tasks to their respective columns in the new structure
        Object.keys(updates.columns).forEach((columnId) => {
          const existingTasks = updates.columns![columnId].tasks;
          if (existingTasks.length === 0) {
            // Only copy tasks if the column is empty (new column)
            updates.columns![columnId].tasks = allTasks.filter((task) =>
              prev[projectId].columns[columnId]?.tasks.some(
                (t) => t.id === task.id,
              ),
            );
          }
        });
      }

      return newProjects;
    });
  };

  const handleTeamUpdate = (newTeam: Assignee[]) => {
    setWorkspaces((prev) =>
      prev.map((w) =>
        w.id === currentWorkspace ? { ...w, team: newTeam } : w,
      ),
    );

    setProjects((prev) => {
      const newProjects = { ...prev };
      Object.keys(newProjects).forEach((projectId) => {
        if (newProjects[projectId].workspaceId === currentWorkspace) {
          newProjects[projectId].team = newTeam;
        }
      });
      return newProjects;
    });
  };

  const handleDeleteTask = (columnId: string, taskId: string) => {
    if (!currentProjectData) return;

    setProjects((prev) => ({
      ...prev,
      [currentProject]: {
        ...prev[currentProject],
        columns: {
          ...prev[currentProject].columns,
          [columnId]: {
            ...prev[currentProject].columns[columnId],
            tasks: prev[currentProject].columns[columnId].tasks.filter(
              (t) => t.id !== taskId,
            ),
          },
        },
      },
    }));

    setSelectedTask(null);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    if (!currentProjectData) return;

    setProjects((prev) => {
      const newProjects = { ...prev };
      const project = newProjects[currentProject];

      for (const columnId in project.columns) {
        const taskIndex = project.columns[columnId].tasks.findIndex(
          (t) => t.id === taskId,
        );
        if (taskIndex !== -1) {
          project.columns[columnId].tasks[taskIndex] = {
            ...project.columns[columnId].tasks[taskIndex],
            ...updates,
          };
          break;
        }
      }

      return newProjects;
    });
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

  const workspaceProjects = Object.values(projects).filter(
    (p) => p.workspaceId === currentWorkspace,
  );

  const handleWorkspaceSelect = (workspaceId: string) => {
    setCurrentWorkspace(workspaceId);
    setCurrentProject(`projects-${workspaceId}`);
  };

  // Add the projects overview to the current workspace's projects
  if (!projects[`projects-${currentWorkspace}`]) {
    // @ts-ignore: TODO
    projects[`projects-${currentWorkspace}`] = projectsOverview;
  }

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

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 z-0 opacity-50 dark:opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='200' height='200' patternUnits='userSpaceOnUse' patternTransform='rotate(12)'%3E%3Cpath d='M 200 0 L 0 0 0 200' fill='none' stroke='rgba(37, 99, 235, 0.45)' stroke-width='2.5' class='light-stroke'/%3E%3Cpath d='M 200 0 L 0 0 0 200' fill='none' stroke='rgba(96, 165, 250, 0.55)' stroke-width='2.5' class='dark-stroke' style='display:none'/%3E%3C/pattern%3E%3CradialGradient id='fade' cx='50%25' cy='50%25' r='70%25' fx='50%25' fy='50%25'%3E%3Cstop offset='0%25' style='stop-color:white;stop-opacity:0' /%3E%3Cstop offset='70%25' style='stop-color:white;stop-opacity:1' /%3E%3C/radialGradient%3E%3Cmask id='mask' x='0' y='0' width='100%25' height='100%25'%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='url(%23fade)'/%3E%3C/mask%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' mask='url(%23mask)'/%3E%3Cstyle%3E@media (prefers-color-scheme: dark) { .light-stroke { display: none; } .dark-stroke { display: block !important; } }%3C/style%3E%3C/svg%3E")`,
              backgroundSize: "cover",
            }}
          ></div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-100/70 via-transparent to-gray-100/70 dark:from-gray-800/70 dark:via-transparent dark:to-gray-800/70"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 border-gray-200 border-b bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex items-center">
                <h1 className="font-bold text-primary-600 text-xl dark:text-primary-400">
                  Runa
                </h1>
              </div>
              <div className="flex items-center space-x-6">
                <ThemeToggle />
                <Link
                  href="/docs"
                  className="font-medium text-gray-600 text-sm hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  Docs
                </Link>
                <button
                  type="button"
                  onClick={handleLogin}
                  className="rounded-md bg-primary-600 px-4 py-2 font-medium text-sm text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero section */}
          <div className="py-20 md:py-28 lg:py-36">
            <div className="relative z-10 max-w-3xl">
              <div className="mb-5 inline-block rounded-full bg-primary-100 px-3 py-1 font-semibold text-primary-700 text-xs shadow-sm dark:bg-primary-900/30 dark:text-primary-300">
                Introducing Runa
              </div>
              <h1 className="mb-8 font-extrabold text-4xl text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
                Transform Your Projects into{" "}
                <span className="relative whitespace-nowrap text-primary-600 dark:text-primary-400">
                  <span className="relative z-10">Success Stories</span>
                  <span className="-inset-1 -skew-y-3 -z-10 absolute rounded-sm bg-primary-100 dark:bg-primary-900/40"></span>
                </span>
              </h1>
              <p className="mb-12 max-w-2xl text-gray-600 text-xl leading-relaxed dark:text-gray-400">
                Streamline your workflow, collaborate seamlessly, and deliver
                projects on time with our intuitive Kanban board solution.
              </p>
              <div className="flex flex-col gap-5 sm:flex-row">
                <button
                  type="button"
                  onClick={handleLogin}
                  className="group cursor-pointer rounded-lg bg-primary-600 px-8 py-4 font-medium text-base text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
                >
                  Get Started{" "}
                  <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
                <Link
                  href="/pricing"
                  className="rounded-lg border border-gray-300 bg-white px-8 py-4 text-center font-medium text-base text-primary-600 shadow-sm hover:bg-gray-50 hover:shadow dark:border-gray-700 dark:bg-gray-800 dark:text-primary-400 dark:hover:bg-gray-700"
                >
                  View Pricing
                </Link>
              </div>
            </div>

            {/* Features grid */}
            <div className="relative z-10 mt-32">
              <div className="mb-16 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <h2 className="relative inline-block font-bold text-2xl text-gray-900 dark:text-white">
                  <span>
                    Everything you need to manage projects effectively
                  </span>
                  <span className="-bottom-2 absolute right-0 left-0 h-1 rounded-full bg-primary-600/30 dark:bg-primary-600/40"></span>
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm transition-transform hover:translate-y-[-2px] hover:border-primary-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-800">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/50">
                    <svg
                      className="h-6 w-6 text-primary-600 dark:text-primary-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-label="Task Management Icon"
                    >
                      <title>Task Management Icon</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900 text-lg dark:text-gray-100">
                    Task Management
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Organize and track your tasks with flexible views and
                    intuitive workflows.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm transition-transform hover:translate-y-[-2px] hover:border-purple-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-purple-800">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/50">
                    <svg
                      className="h-6 w-6 text-purple-600 dark:text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-label="Team Collaboration Icon"
                    >
                      <title>Team Collaboration Icon</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900 text-lg dark:text-gray-100">
                    Team Collaboration
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Collaborate effortlessly with team members through comments,
                    mentions, and assignments.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm transition-transform hover:translate-y-[-2px] hover:border-green-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-800">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
                    <svg
                      className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-label="Customizable Workflows Icon"
                    >
                      <title>Customizable Workflows Icon</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900 text-lg dark:text-gray-100">
                    Customizable Workflows
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Create custom workflows that match your team's processes and
                    project needs.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm transition-transform hover:translate-y-[-2px] hover:border-amber-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-amber-800">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50">
                    <svg
                      className="h-6 w-6 text-amber-600 dark:text-amber-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-label="Project Analytics Icon"
                    >
                      <title>Project Analytics Icon</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900 text-lg dark:text-gray-100">
                    Project Analytics
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Get insights into your team's performance with detailed
                    analytics and progress tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
            workspaces={workspaces}
            currentWorkspace={currentWorkspace}
            onWorkspaceSelect={handleWorkspaceSelect}
            onWorkspaceCreate={handleWorkspaceCreate}
            onWorkspaceDelete={handleWorkspaceDelete}
            projects={workspaceProjects}
            currentProject={currentProject}
            onProjectSelect={setCurrentProject}
            onProjectCreate={handleProjectCreate}
            onProjectDelete={handleProjectDelete}
            onOpenWorkspaceSettings={() => setIsWorkspaceSettingsOpen(true)}
            onSignOut={() => setIsAuthenticated(false)}
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
              onViewModeChange={(viewMode) =>
                handleProjectUpdate(currentProject, { viewMode })
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
              handleProjectUpdate(currentProject, updates);
            }}
          />
        ) : (
          <ProjectSettings
            project={currentProjectData}
            onClose={() => setIsSettingsOpen(false)}
            onUpdate={(updates) => {
              handleProjectUpdate(currentProject, updates);
            }}
            onImport={() => fileInputRef.current?.click()}
            onExport={handleExportProject}
          />
        ))}

      {isWorkspaceSettingsOpen && (
        <WorkspaceSettings
          team={workspaces.find((w) => w.id === currentWorkspace)?.team || []}
          onClose={() => setIsWorkspaceSettingsOpen(false)}
          onUpdate={handleTeamUpdate}
        />
      )}

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
          onDelete={(taskId) => {
            for (const columnId in currentProjectData.columns) {
              const column = currentProjectData.columns[columnId];
              if (column.tasks.some((t) => t.id === taskId)) {
                handleDeleteTask(columnId, taskId);
                break;
              }
            }
          }}
          onUpdate={handleUpdateTask}
        />
      )}
    </div>
  );
}
