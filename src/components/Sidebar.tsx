import { useNavigate, useParams } from "@tanstack/react-router";
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
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import Link from "./core/Link";
import { Button } from "./ui/button";
import WorkspaceSettings from "./WorkspaceSettings";

import type { Project } from "@/generated/graphql";

interface SidebarProps {
  projects: Partial<Project | null>[] | undefined;
  currentProject?: string;
}

const Sidebar = ({ projects, currentProject }: SidebarProps) => {
  const { workspaceId } = useParams({ strict: false });

  const navigate = useNavigate();

  const { setIsOpen: setIsWorkspaceSettingsOpen } = useDialogStore({
    type: DialogType.WorkspaceSettings,
  });

  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const handleProjectsHeaderClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;

    setIsProjectsOpen(!isProjectsOpen);
  };

  return (
    <div className="flex h-full flex-col border-base-200 border-r bg-white dark:border-base-700 dark:bg-base-800/40">
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex-1">
            <WorkspaceSelector />
          </div>

          <ThemeToggle />
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto">
          <div
            className="flex cursor-pointer items-center justify-between rounded px-2 py-3 font-medium text-base-700 text-sm hover:bg-base-50 dark:text-base-200 dark:hover:bg-base-700/50"
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
              className="rounded-md p-1 hover:bg-base-100 dark:hover:bg-base-700"
            >
              <Plus className="h-3 w-3 text-base-500 dark:text-base-400" />
            </button>
          </div>

          {isProjectsOpen && (
            <div className="mt-1">
              <Link
                to="/workspaces/$workspaceId/projects"
                params={{
                  workspaceId: workspaceId!,
                }}
                variant="ghost"
                activeOptions={{ exact: true }}
                activeProps={{
                  variant: "outline",
                }}
                className="w-full"
              >
                Overview
              </Link>

              <div className="my-2 border-base-200 border-t dark:border-base-700" />

              {isAddingProject && (
                <form
                  // onSubmit={handleCreateProject}
                  className="space-y-2 px-2 py-1"
                >
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Project name"
                    className="w-full rounded border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-base-600 dark:bg-base-700 dark:text-base-200"
                    // biome-ignore lint/a11y/noAutofocus: TODO
                    autoFocus
                  />
                  <textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Project description (optional)"
                    className="h-20 w-full resize-none rounded border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-base-600 dark:bg-base-700 dark:text-base-200"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProject(false);
                        setNewProjectName("");
                        setNewProjectDescription("");
                      }}
                      className="px-2 py-1 text-base-600 text-xs hover:text-base-900 dark:text-base-400 dark:hover:text-base-100"
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

              {projects?.map((project) => (
                <Link
                  key={project?.rowId}
                  to="/workspaces/$workspaceId/projects/$projectId"
                  params={{
                    workspaceId: workspaceId!,
                    projectId: project?.rowId!,
                  }}
                  variant="ghost"
                  activeProps={{
                    variant: "outline",
                  }}
                  className="group my-1 w-full justify-between"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    {project?.viewMode === "board" ? (
                      <LayoutGrid
                        className="h-3 w-3 flex-shrink-0"
                        style={{ color: project.color || "currentColor" }}
                      />
                    ) : (
                      <List
                        className="h-3 w-3 flex-shrink-0"
                        style={{ color: project?.color || "currentColor" }}
                      />
                    )}
                    <span className="cursor-pointer truncate">
                      {project?.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      setProjectToDelete(project?.rowId!);
                    }}
                    className="-mr-3 size-4 p-1 opacity-0 hover:text-red-500 group-hover:opacity-100 dark:hover:text-red-400"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 border-base-200 border-t p-4 dark:border-base-700">
        <Button
          type="button"
          disabled={!workspaceId}
          onClick={() => setIsWorkspaceSettingsOpen(true)}
          variant="outline"
          className="w-full"
        >
          <Users className="h-4 w-4" />
          Workspace Settings
        </Button>

        <Button
          type="button"
          onClick={() => navigate({ to: "/" })}
          variant="outline"
          className="w-full text-red-600 dark:text-red-400 dark:hover:bg-base-700"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {projectToDelete && (
        <ConfirmDialog
          title="Delete Project"
          message="Are you sure you want to delete this project? This action cannot be undone."
          onConfirm={() => {
            // onProjectDelete?.(projectToDelete);
            setProjectToDelete(null);
          }}
          onCancel={() => setProjectToDelete(null)}
        />
      )}

      <WorkspaceSettings
        // TODO
        team={[]}
      />
    </div>
  );
};

export default Sidebar;
