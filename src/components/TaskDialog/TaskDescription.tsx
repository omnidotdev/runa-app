'use client';

import { Type } from 'lucide-react';
import { RichTextEditor } from '../RichTextEditor';
import { Project, Task } from '@/types';

interface TaskDescriptionProps {
  description: string;
  isNew: boolean;
  isEditing: boolean;
  projects: Project[];
  tasks: Task[];
  team: Assignee[];
  onDescriptionChange: (content: string) => void;
  onEditStart: () => void;
}

export function TaskDescription({
  description,
  isNew,
  isEditing,
  projects,
  tasks,
  team,
  onDescriptionChange,
  onEditStart,
}: TaskDescriptionProps) {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <div className="flex items-center gap-2 mb-2">
        <Type className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 m-0">Description</h3>
      </div>
      <div>
        <RichTextEditor
          content={description}
          onChange={onDescriptionChange}
          placeholder="Add a more detailed description..."
          projects={projects}
          tasks={tasks}
          team={team}
          readOnly={!isNew && !isEditing}
          autoFocus={isNew || isEditing}
          onEditStart={onEditStart}
        />
      </div>
    </div>
  );
}