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

/** Tool names that delegate to another agent persona. */
export const DELEGATION_TOOL_NAMES = new Set(["delegateToAgent"]);

/** Tool names for project creation flow. */
export const PROJECT_CREATION_TOOL_NAMES = new Set([
  "proposeProject",
  "createProjectFromProposal",
]);
