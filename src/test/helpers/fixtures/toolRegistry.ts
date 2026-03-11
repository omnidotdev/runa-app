import type { ToolRegistryResponse } from "@/lib/options/toolRegistry.options";

/** Mock tool registry response matching the API's real registry. */
export const mockToolRegistry: ToolRegistryResponse = {
  tools: {
    getTask: { category: "query", entity: "task" },
    queryTasks: { category: "query", entity: "task" },
    queryProject: { category: "query", entity: "project" },
    createTasks: { category: "write", entity: "task" },
    updateTasks: { category: "write", entity: "task" },
    createColumns: { category: "write", entity: "column" },
    updateColumns: { category: "write", entity: "column" },
    createComments: { category: "write", entity: "comment" },
    deleteTasks: { category: "destructive", entity: "task" },
    deleteColumns: { category: "destructive", entity: "column" },
    delegateToAgent: { category: "delegation", entity: null },
    proposeProject: { category: "projectCreation", entity: "project" },
    createProjectFromProposal: {
      category: "projectCreation",
      entity: "project",
    },
  },
  categories: [
    "query",
    "write",
    "destructive",
    "delegation",
    "projectCreation",
  ],
  entities: ["task", "column", "label", "comment", "project", null],
};
