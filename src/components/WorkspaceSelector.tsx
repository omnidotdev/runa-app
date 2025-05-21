'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';

interface Workspace {
  id: string;
  name: string;
}

interface WorkspaceSelectorProps {
  workspaces: Workspace[];
  currentWorkspace: string;
  onWorkspaceSelect: (workspaceId: string) => void;
  onWorkspaceCreate: (workspace: Workspace) => void;
  onWorkspaceDelete: (workspaceId: string) => void;
}

export function WorkspaceSelector({
  workspaces,
  currentWorkspace,
  onWorkspaceSelect,
  onWorkspaceCreate,
  onWorkspaceDelete,
}: WorkspaceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [workspaceToDelete, setWorkspaceToDelete] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        if (isCreating) {
          setIsCreating(false);
          setNewWorkspaceName('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCreating]);

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  const handleCreateWorkspace = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newWorkspaceName.trim()) return;

    const newWorkspace: Workspace = {
      id: newWorkspaceName.toLowerCase().replace(/\s+/g, '-'),
      name: newWorkspaceName.trim(),
    };

    onWorkspaceCreate(newWorkspace);
    setNewWorkspaceName('');
    setIsCreating(false);
    setIsOpen(false);
  };

  const currentWorkspaceData = workspaces.find(w => w.id === currentWorkspace);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <span className="truncate">{currentWorkspaceData?.name || 'Select Workspace'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          {isCreating ? (
            <form onSubmit={handleCreateWorkspace} className="p-2">
              <input
                ref={inputRef}
                type="text"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                placeholder="Workspace name"
                className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewWorkspaceName('');
                  }}
                  className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newWorkspaceName.trim()}
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </form>
          ) : (
            <>
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className="relative group"
                >
                  <button
                    onClick={() => {
                      onWorkspaceSelect(workspace.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm ${
                      workspace.id === currentWorkspace
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {workspace.name}
                  </button>
                  {workspaces.length > 1 && workspace.id === currentWorkspace && (
                    <button
                      onClick={() => setWorkspaceToDelete(workspace.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-all"
                    >
                      <Plus className="w-3 h-3 rotate-45 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400" />
                    </button>
                  )}
                </div>
              ))}
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
              <button
                onClick={() => setIsCreating(true)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Plus className="w-4 h-4" />
                New Workspace
              </button>
            </>
          )}
        </div>
      )}

      {workspaceToDelete && (
        <ConfirmDialog
          title="Delete Workspace"
          message="Are you sure you want to delete this workspace? This will delete all projects and tasks within it."
          onConfirm={() => {
            onWorkspaceDelete(workspaceToDelete);
            setWorkspaceToDelete(null);
            setIsOpen(false);
          }}
          onCancel={() => setWorkspaceToDelete(null)}
        />
      )}
    </div>
  );
}