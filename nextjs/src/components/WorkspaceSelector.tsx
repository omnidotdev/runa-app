import { ChevronDown, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import ConfirmDialog from "@/components/ConfirmDialog";

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

const WorkspaceSelector = ({
  workspaces,
  currentWorkspace,
  onWorkspaceSelect,
  onWorkspaceCreate,
  onWorkspaceDelete,
}: WorkspaceSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [workspaceToDelete, setWorkspaceToDelete] = useState<string | null>(
    null,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        if (isCreating) {
          setIsCreating(false);
          setNewWorkspaceName("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      id: newWorkspaceName.toLowerCase().replace(/\s+/g, "-"),
      name: newWorkspaceName.trim(),
    };

    onWorkspaceCreate(newWorkspace);
    setNewWorkspaceName("");
    setIsCreating(false);
    setIsOpen(false);
  };

  const currentWorkspaceData = workspaces.find(
    (w) => w.id === currentWorkspace,
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-100 px-3 py-2 font-medium text-gray-900 text-sm hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
      >
        <span className="truncate">
          {currentWorkspaceData?.name || "Select Workspace"}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {isCreating ? (
            <form onSubmit={handleCreateWorkspace} className="p-2">
              <input
                ref={inputRef}
                type="text"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                placeholder="Workspace name"
                className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewWorkspaceName("");
                  }}
                  className="px-2 py-1 text-gray-600 text-xs hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newWorkspaceName.trim()}
                  className="rounded bg-primary-500 px-2 py-1 text-white text-xs hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </form>
          ) : (
            <>
              {workspaces.map((workspace) => (
                <div key={workspace.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => {
                      onWorkspaceSelect(workspace.id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm ${
                      workspace.id === currentWorkspace
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    {workspace.name}
                  </button>
                  {workspaces.length > 1 &&
                    workspace.id === currentWorkspace && (
                      <button
                        type="button"
                        onClick={() => setWorkspaceToDelete(workspace.id)}
                        className="-translate-y-1/2 absolute top-1/2 right-2 rounded p-1 opacity-0 hover:bg-gray-200 group-hover:opacity-100 dark:hover:bg-gray-600"
                      >
                        <Plus className="h-3 w-3 rotate-45 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400" />
                      </button>
                    )}
                </div>
              ))}
              <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="flex w-full items-center gap-2 px-3 py-2 text-gray-700 text-sm hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Plus className="h-4 w-4" />
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
};

export default WorkspaceSelector;
