"use client";

import { Type } from "lucide-react";

import RichTextEditor from "../RichTextEditor";

import type { Assignee, Project, Task } from "@/types";

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

const TaskDescription = ({
  description,
  isNew,
  isEditing,
  projects,
  tasks,
  team,
  onDescriptionChange,
  onEditStart,
}: TaskDescriptionProps) => {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <div className="mb-2 flex items-center gap-2">
        <Type className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <h3 className="m-0 font-medium text-gray-700 text-sm dark:text-gray-300">
          Description
        </h3>
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
};

export default TaskDescription;
