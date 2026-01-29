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

/** Tool names that perform destructive delete operations (red styling). */
export const DESTRUCTIVE_TOOL_NAMES = new Set([
  "deleteTask",
  "batchDeleteTasks",
]);

/** Tool names that perform batch operations on multiple items (amber styling). */
export const BATCH_TOOL_NAMES = new Set(["batchMoveTasks", "batchUpdateTasks"]);

/** Tool names that delegate to another agent persona. */
export const DELEGATION_TOOL_NAMES = new Set(["delegateToAgent"]);

/** Tool names for project creation flow. */
export const PROJECT_CREATION_TOOL_NAMES = new Set([
  "proposeProject",
  "createProjectFromProposal",
]);
