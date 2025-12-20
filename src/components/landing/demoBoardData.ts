export interface DemoLabel {
  name: string;
  color: string;
}

export interface DemoAssignee {
  name: string;
  avatarUrl?: string;
}

export interface DemoTask {
  rowId: string;
  columnId: string;
  columnIndex: number;
  content: string;
  priority: "high" | "medium" | "low" | null;
  labels: DemoLabel[];
  assignees: DemoAssignee[];
}

export interface DemoColumn {
  rowId: string;
  title: string;
  emoji: string;
}

export const demoColumns: DemoColumn[] = [
  { rowId: "col-todo", title: "Todo", emoji: "📋" },
  { rowId: "col-progress", title: "In Progress", emoji: "🚀" },
  { rowId: "col-done", title: "Done", emoji: "✅" },
];

export const initialDemoTasks: DemoTask[] = [
  {
    rowId: "task-1",
    columnId: "col-todo",
    columnIndex: 0,
    content: "Design homepage mockups",
    priority: "high",
    labels: [{ name: "Design", color: "#8b5cf6" }],
    assignees: [{ name: "Alex" }],
  },
  {
    rowId: "task-2",
    columnId: "col-todo",
    columnIndex: 1,
    content: "Set up CI/CD pipeline",
    priority: "medium",
    labels: [{ name: "DevOps", color: "#f59e0b" }],
    assignees: [],
  },
  {
    rowId: "task-3",
    columnId: "col-progress",
    columnIndex: 1,
    content: "Write API documentation",
    priority: "low",
    labels: [{ name: "Docs", color: "#6366f1" }],
    assignees: [{ name: "Casey" }],
  },
  {
    rowId: "task-4",
    columnId: "col-done",
    columnIndex: 1,
    content: "Deploy to staging",
    priority: "high",
    labels: [{ name: "DevOps", color: "#f59e0b" }],
    assignees: [{ name: "Alex" }, { name: "Jordan" }],
  },
];
