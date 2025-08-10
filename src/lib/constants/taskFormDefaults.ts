export const taskFormDefaults = {
  title: "",
  description: "",
  labels: [] as {
    name: string;
    color: string;
    checked: boolean;
    rowId: string;
  }[],
  assignees: [] as string[],
  dueDate: "",
  columnId: "",
  priority: "low",
};
