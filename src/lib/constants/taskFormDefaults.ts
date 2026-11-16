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
  /** The picked due day (`YYYY-MM-DD`), or empty for none */
  dueDate: "",
  columnId: "",
  priority: "low",
};
