'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Assignee } from '@/types';
import { ConfirmDialog } from './ConfirmDialog';

interface WorkspaceSettingsProps {
  team: Assignee[];
  onClose: () => void;
  onUpdate: (team: Assignee[]) => void;
}

export function WorkspaceSettings({ team, onClose, onUpdate }: WorkspaceSettingsProps) {
  const [members, setMembers] = useState<Assignee[]>(team);
  const [newMemberName, setNewMemberName] = useState('');
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    window.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('mousedown', handleClickOutside);
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
    setNewMemberName('');
  };

  const handleRemoveMember = (memberId: string) => {
    const updatedMembers = members.filter(member => member.id !== memberId);
    setMembers(updatedMembers);
    onUpdate(updatedMembers);
    setMemberToDelete(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg"
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Workspace Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Team Members</h3>
            <div className="space-y-2">
              {members.map(member => (
                <div 
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-gray-900 dark:text-gray-100">
                      {member.name[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{member.name}</span>
                  </div>
                  <button
                    onClick={() => setMemberToDelete(member.id)}
                    className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
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
                className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!newMemberName.trim()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
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
}