'use client';

import { useState } from 'react';
import { Folder, ChevronDown, ChevronRight, Plus, Trash2, Users, LayoutGrid, List, LogOut } from 'lucide-react';
import { Project, Workspace } from '@/types';
import { ThemeToggle } from './ThemeToggle';
import { ConfirmDialog } from './ConfirmDialog';
import { WorkspaceSelector } from './WorkspaceSelector';

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

export function Sidebar({ 
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
}: SidebarProps) {
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const handleCreateProject = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newProjectName.trim()) return;
    
    const newProject: Project = {
      id: newProjectName.toLowerCase().replace(/\s+/g, '-'),
      name: newProjectName,
      description: newProjectDescription.trim() || undefined,
      workspaceId: currentWorkspace,
      team: workspaces.find(w => w.id === currentWorkspace)?.team || [],
      columns: {
        'todo': {
          id: 'todo',
          title: 'To Do',
          tasks: [],
        },
        'in-progress': {
          id: 'in-progress',
          title: 'In Progress',
          tasks: [],
        },
        'done': {
          id: 'done',
          title: 'Done',
          tasks: [],
        },
      },
    };

    onProjectCreate?.(newProject);
    setNewProjectName('');
    setNewProjectDescription('');
    setIsAddingProject(false);
  };

  const handleProjectsHeaderClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    
    setIsProjectsOpen(!isProjectsOpen);
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex-1 p-4 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-4">
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
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div 
            className="flex items-center justify-between px-2 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded cursor-pointer"
            onClick={handleProjectsHeaderClick}
          >
            <div className="flex items-center gap-2">
              {isProjectsOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <Folder className="w-4 h-4" />
              <span>Projects</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAddingProject(true);
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <Plus className="w-3 h-3 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          {isProjectsOpen && (
            <div className="ml-4 mt-1">
              <div
                onClick={() => onProjectSelect(`projects-${currentWorkspace}`)}
                className={`flex items-center gap-2 px-2 py-1 text-sm rounded cursor-pointer ${
                  currentProject === `projects-${currentWorkspace}`
                    ? 'text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/50'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span>Overview</span>
              </div>
              
              <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
              
              {isAddingProject && (
                <form onSubmit={handleCreateProject} className="px-2 py-1 space-y-2">
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Project name"
                    className="w-full text-sm px-2 py-1 border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Project description (optional)"
                    className="w-full text-sm px-2 py-1 border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProject(false);
                        setNewProjectName('');
                        setNewProjectDescription('');
                      }}
                      className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newProjectName.trim()}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create
                    </button>
                  </div>
                </form>
              )}

              {projects
                .filter(project => !project.id.startsWith('projects-'))
                .map(project => (
                  <div
                    key={project.id}
                    className={`flex items-center justify-between px-2 py-1 text-sm rounded group ${
                      currentProject === project.id
                        ? 'text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/50'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {project.viewMode === 'board' ? (
                        <LayoutGrid 
                          className="w-3 h-3 flex-shrink-0" 
                          style={{ color: project.color || 'currentColor' }}
                        />
                      ) : (
                        <List 
                          className="w-3 h-3 flex-shrink-0"
                          style={{ color: project.color || 'currentColor' }}
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
                      onClick={() => setProjectToDelete(project.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-all"
                    >
                      <Trash2 className="w-3 h-3 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={onOpenWorkspaceSettings}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Users className="w-4 h-4" />
          Workspace Settings
        </button>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
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
}