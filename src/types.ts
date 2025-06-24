export interface Assignee {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Task {
  id: string;
  content: string;
  description: string;
  priority: "low" | "medium" | "high";
  assignees: Assignee[];
  labels?: string[];
  dueDate?: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  prefix?: string;
  color?: string;
  labels?: string[];
  workspaceId: string;
  columns: { [key: string]: Column };
  team: Assignee[];
  viewMode: "board" | "list";
}
