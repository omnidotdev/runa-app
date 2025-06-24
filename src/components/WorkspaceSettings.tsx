import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import ConfirmDialog from "@/components/ConfirmDialog";

import type { Assignee } from "@/types";

interface WorkspaceSettingsProps {
  team: Assignee[];
  onClose: () => void;
  onUpdate: (team: Assignee[]) => void;
}

const WorkspaceSettings = ({
  team,
  onClose,
  onUpdate,
}: WorkspaceSettingsProps) => {
  const [members, setMembers] = useState<Assignee[]>(team);
  const [newMemberName, setNewMemberName] = useState("");
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMember: Assignee = {
      id: `user-${Date.now()}`,
      name: newMemberName.trim(),
    };

    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    onUpdate(updatedMembers);
    setNewMemberName("");
  };

  const handleRemoveMember = (memberId: string) => {
    const updatedMembers = members.filter((member) => member.id !== memberId);
    setMembers(updatedMembers);
    onUpdate(updatedMembers);
    setMemberToDelete(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dark:bg-black/70">
      <div
        ref={modalRef}
        className="w-full max-w-lg rounded-lg bg-white dark:bg-base-800"
      >
        <div className="flex items-center justify-between border-base-200 border-b p-6 dark:border-base-700">
          <h2 className="font-semibold text-base-900 text-xl dark:text-base-100">
            Workspace Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-base-500 hover:text-base-700 dark:text-base-400 dark:hover:text-base-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <h3 className="mb-4 font-medium text-base-700 text-sm dark:text-base-300">
              Team Members
            </h3>
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg bg-base-50 p-3 dark:bg-base-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-base-200 font-medium text-base-900 text-sm dark:bg-base-600 dark:text-base-100">
                      {member.name[0].toUpperCase()}
                    </div>
                    <span className="text-base-900 text-sm dark:text-base-100">
                      {member.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMemberToDelete(member.id)}
                    className="p-1 text-base-400 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddMember} className="mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Enter member name"
                className="flex-1 rounded-md border border-base-200 bg-white px-3 py-2 text-base-900 text-sm placeholder-base-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-base-600 dark:bg-base-700 dark:text-base-100 dark:placeholder-base-400"
              />
              <button
                type="submit"
                disabled={!newMemberName.trim()}
                className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 font-medium text-sm text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Add Member
              </button>
            </div>
          </form>
        </div>
      </div>

      {memberToDelete && (
        <ConfirmDialog
          title="Remove Team Member"
          message="Are you sure you want to remove this team member? They will be removed from all projects and tasks."
          onConfirm={() => handleRemoveMember(memberToDelete)}
          onCancel={() => setMemberToDelete(null)}
        />
      )}
    </div>
  );
};

export default WorkspaceSettings;
