import dayjs from "dayjs";

import { storedDueDate } from "@/lib/util/dueDate";

export interface DemoLabel {
  name: string;
  color: string;
}

export interface DemoAssignee {
  name: string;
  color: string;
  avatarUrl?: string;
}

export interface DemoTask {
  rowId: string;
  columnId: string;
  columnIndex: number;
  number: number;
  content: string;
  priority: "high" | "medium" | "low" | null;
  labels: DemoLabel[];
  assignees: DemoAssignee[];
  /** Local start-of-day instant, or null when unscheduled (shown in the
   * calendar's unscheduled rail). Stored via `storedDueDate` so the calendar
   * buckets it the same way the real app does. */
  dueDate: Date | null;
}

/** A local day relative to today, so the demo tasks always land in the visible
 * month regardless of when the page is viewed. */
const demoDueDate = (offsetDays: number): Date =>
  storedDueDate(dayjs().add(offsetDays, "day").format("YYYY-MM-DD"));

export interface DemoColumn {
  rowId: string;
  title: string;
  icon: string;
}

export const demoColumns: DemoColumn[] = [
  { rowId: "col-todo", title: "Todo", icon: "emoji:📋" },
  { rowId: "col-progress", title: "In Progress", icon: "emoji:🚀" },
  { rowId: "col-done", title: "Done", icon: "emoji:✅" },
];

export const initialDemoTasks: DemoTask[] = [
  {
    rowId: "task-1",
    columnId: "col-todo",
    columnIndex: 0,
    number: 1,
    content: "Design homepage mockups",
    priority: "high",
    labels: [{ name: "Design", color: "#8b5cf6" }],
    assignees: [{ name: "Alex", color: "#3b82f6" }],
    // past due and not done -> renders overdue (red) on the calendar
    dueDate: demoDueDate(-2),
  },
  {
    rowId: "task-2",
    columnId: "col-todo",
    columnIndex: 1,
    number: 2,
    content: "Set up CI/CD pipeline",
    priority: "medium",
    labels: [{ name: "DevOps", color: "#f59e0b" }],
    assignees: [],
    // unscheduled -> shown in the calendar's unscheduled rail
    dueDate: null,
  },
  {
    rowId: "task-3",
    columnId: "col-progress",
    columnIndex: 0,
    number: 3,
    content: "Write API documentation",
    priority: "low",
    labels: [{ name: "Docs", color: "#6366f1" }],
    assignees: [{ name: "Casey", color: "#10b981" }],
    dueDate: demoDueDate(3),
  },
  {
    rowId: "task-4",
    columnId: "col-done",
    columnIndex: 0,
    number: 4,
    content: "Deploy to staging",
    priority: "high",
    labels: [{ name: "DevOps", color: "#f59e0b" }],
    assignees: [
      { name: "Alex", color: "#3b82f6" },
      { name: "Jordan", color: "#ec4899" },
    ],
    // done -> struck through on the calendar, never overdue
    dueDate: demoDueDate(-1),
  },
];
