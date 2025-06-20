import {
  ChevronDown,
  ChevronRight,
  Folder,
  LayoutGrid,
  List,
  LogOut,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";

import ConfirmDialog from "@/components/ConfirmDialog";
import ThemeToggle from "@/components/ThemeToggle";
import WorkspaceSelector from "@/components/WorkspaceSelector";

import type { Project, Workspace } from "@/types";

interface SidebarProps {
  workspaces: Workspace[];
  currentWorkspace: string;
  onWorkspaceSelect: (workspaceId: string) => void;
  onWorkspaceCreate: (workspace: Workspace) => void;
  onWorkspaceDelete: (workspaceId: string) => void;
  projects: Project[];
  currentProject: string;
  onProjectSelect: (projectId: string) => void;
  onProjectCreate?: (project: Project) => void;
  onProjectDelete?: (projectId: string) => void;
  onOpenWorkspaceSettings: () => void;
  onSignOut: () => void;
}

const Sidebar = ({
  workspaces,
  currentWorkspace,
  onWorkspaceSelect,
  onWorkspaceCreate,
  onWorkspaceDelete,
  projects,
  currentProject,
  onProjectSelect,
  onProjectCreate,
  onProjectDelete,
  onOpenWorkspaceSettings,
  onSignOut,
}: SidebarProps) => {
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const handleCreateProject = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newProjectName.trim()) return;

    const newProject: Project = {
      id: newProjectName.toLowerCase().replace(/\s+/g, "-"),
      name: newProjectName,
      description: newProjectDescription.trim() || undefined,
      workspaceId: currentWorkspace,
      team: workspaces.find((w) => w.id === currentWorkspace)?.team || [],
      columns: {
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
        done: {
          id: "done",
          title: "Done",
          tasks: [],
        },
      },
    };

    onProjectCreate?.(newProject);
    setNewProjectName("");
    setNewProjectDescription("");
    setIsAddingProject(false);
  };

  const handleProjectsHeaderClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;

    setIsProjectsOpen(!isProjectsOpen);
  };

  return (
    <div className="flex h-full flex-col border-gray-200 border-r bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex min-h-0 flex-1 flex-col p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex-1">
            <WorkspaceSelector
              workspaces={workspaces}
              currentWorkspace={currentWorkspace}
              onWorkspaceSelect={onWorkspaceSelect}
              onWorkspaceCreate={onWorkspaceCreate}
              onWorkspaceDelete={onWorkspaceDelete}
            />
          </div>
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto">
          <div
            className="flex cursor-pointer items-center justify-between rounded px-2 py-1 font-medium text-gray-700 text-sm hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50"
            onClick={handleProjectsHeaderClick}
          >
            <div className="flex items-center gap-2">
              {isProjectsOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <Folder className="h-4 w-4" />
              <span>Projects</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsAddingProject(true);
              }}
              className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Plus className="h-3 w-3 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {isProjectsOpen && (
            <div className="mt-1 ml-4">
              <div
                onClick={() => onProjectSelect(`projects-${currentWorkspace}`)}
                className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm ${
                  currentProject === `projects-${currentWorkspace}`
                    ? "bg-gray-50 text-gray-700 dark:bg-gray-700/50 dark:text-gray-200"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                }`}
              >
                <span>Overview</span>
              </div>

              <div className="my-2 border-gray-200 border-t dark:border-gray-700" />

              {isAddingProject && (
                <form
                  onSubmit={handleCreateProject}
                  className="space-y-2 px-2 py-1"
                >
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Project name"
                    className="w-full rounded border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    // biome-ignore lint/a11y/noAutofocus: TODO
                    autoFocus
                  />
                  <textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Project description (optional)"
                    className="h-20 w-full resize-none rounded border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProject(false);
                        setNewProjectName("");
                        setNewProjectDescription("");
                      }}
                      className="px-2 py-1 text-gray-600 text-xs hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newProjectName.trim()}
                      className="rounded bg-primary-500 px-2 py-1 text-white text-xs hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Create
                    </button>
                  </div>
                </form>
              )}

              {projects
                .filter((project) => !project.id.startsWith("projects-"))
                .map((project) => (
                  <div
                    key={project.id}
                    className={`group flex items-center justify-between rounded px-2 py-1 text-sm ${
                      currentProject === project.id
                        ? "bg-gray-50 text-gray-700 dark:bg-gray-700/50 dark:text-gray-200"
                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      {project.viewMode === "board" ? (
                        <LayoutGrid
                          className="h-3 w-3 flex-shrink-0"
                          style={{ color: project.color || "currentColor" }}
                        />
                      ) : (
                        <List
                          className="h-3 w-3 flex-shrink-0"
                          style={{ color: project.color || "currentColor" }}
                        />
                      )}
                      <span
                        className="cursor-pointer truncate"
                        onClick={() => onProjectSelect(project.id)}
                      >
                        {project.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProjectToDelete(project.id)}
                      className="rounded-md p-1 opacity-0 transition-all hover:bg-gray-200 group-hover:opacity-100 dark:hover:bg-gray-600"
                    >
                      <Trash2 className="h-3 w-3 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 border-gray-200 border-t p-4 dark:border-gray-700">
        <button
          type="button"
          onClick={onOpenWorkspaceSettings}
          className="flex w-full items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <Users className="h-4 w-4" />
          Workspace Settings
        </button>
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 font-medium text-red-600 text-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>

      {projectToDelete && (
        <ConfirmDialog
          title="Delete Project"
          message="Are you sure you want to delete this project? This action cannot be undone."
          onConfirm={() => {
            onProjectDelete?.(projectToDelete);
            setProjectToDelete(null);
          }}
          onCancel={() => setProjectToDelete(null)}
        />
      )}
    </div>
  );
};

export default Sidebar;
