import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ChevronDown, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import ConfirmDialog from "@/components/ConfirmDialog";
import Link from "@/components/core/Link";
import { Button } from "@/components/ui/button";
import {
  useCreateWorkspaceMutation,
  useDeleteWorkspaceMutation,
} from "@/generated/graphql";
import workspaceOptions from "@/lib/options/workspace.options";
import workspacesOptions from "@/lib/options/workspaces.options";
import getQueryClient from "@/utils/getQueryClient";

const WorkspaceSelector = () => {
  const { workspaceId } = useParams({ strict: false });

  const navigate = useNavigate();

  const queryClient = getQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [workspaceToDelete, setWorkspaceToDelete] = useState<string | null>(
    null,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: workspaces } = useQuery({
    ...workspacesOptions,
    select: (data) => data.workspaces?.nodes,
  });

  const { data: currentWorkspace } = useQuery({
    ...workspaceOptions(workspaceId!),
    enabled: !!workspaceId,
    select: (data) => data?.workspace,
  });

  const { mutateAsync: createNewWorkspace } = useCreateWorkspaceMutation({
    onSettled: () => queryClient.invalidateQueries(workspacesOptions),
  });

  const { mutate: deleteWorkspace } = useDeleteWorkspaceMutation({
    // TODO: navigate to workspaces overview page when ready
    onMutate: () => navigate({ to: "/", replace: true }),
  });

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

  const handleCreateWorkspace = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newWorkspaceName.trim()) return;

    await createNewWorkspace({
      input: {
        workspace: {
          name: newWorkspaceName,
        },
      },
    });

    setNewWorkspaceName("");
    setIsCreating(false);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-lg bg-gray-100 px-3 py-2 font-medium text-gray-900 text-sm hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
      >
        <span className="truncate">
          {currentWorkspace?.name || "Select Workspace"}
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
              {workspaces?.map((workspace) => (
                <div
                  key={workspace?.rowId}
                  // TODO: active styles. Waiting for `cn` from shadcn implementation so that styles are properly merged
                  className="w-full"
                >
                  <Link
                    to="/workspaces/$workspaceId"
                    params={{ workspaceId: workspace?.rowId! }}
                    variant="ghost"
                    className="group relative w-full justify-start rounded-none"
                    onClick={() => setIsOpen(false)}
                  >
                    {workspace?.name}

                    {workspaces.length > 1 &&
                      workspace?.rowId === currentWorkspace?.rowId && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            setWorkspaceToDelete(workspace?.rowId!);
                          }}
                          className="-translate-y-1/2 absolute top-1/2 right-2 size-4 opacity-0 hover:text-red-500 group-hover:opacity-100 dark:hover:text-red-400"
                        >
                          <Plus className="h-3 w-3 rotate-45" />
                        </Button>
                      )}
                  </Link>
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
            deleteWorkspace({ rowId: workspaceToDelete! });
            setIsOpen(false);
          }}
          onCancel={() => setWorkspaceToDelete(null)}
        />
      )}
    </div>
  );
};

export default WorkspaceSelector;
