/** Tool names that perform write operations on the board. */
export const WRITE_TOOL_NAMES = new Set([
  "createTask",
  "updateTask",
  "moveTask",
  "assignTask",
  "addLabel",
  "removeLabel",
  "addComment",
  "deleteTask",
  "batchMoveTasks",
  "batchUpdateTasks",
  "batchDeleteTasks",
]);

/** Tool names that perform destructive/batch operations (may require approval). */
export const DESTRUCTIVE_TOOL_NAMES = new Set([
  "deleteTask",
  "batchMoveTasks",
  "batchUpdateTasks",
  "batchDeleteTasks",
]);
