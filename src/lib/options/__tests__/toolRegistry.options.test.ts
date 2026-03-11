import { describe, expect, test } from "vitest";

import { mockToolRegistry } from "@/test/helpers/fixtures/toolRegistry";
import {
  isColumnTool,
  isDelegationTool,
  isDestructiveTool,
  isProjectCreationTool,
  isWriteTool,
} from "../toolRegistry.options";

const registry = mockToolRegistry;

// ─────────────────────────────────────────────
// isWriteTool
// ─────────────────────────────────────────────

describe("isWriteTool", () => {
  test("returns true for write category tools", () => {
    expect(isWriteTool("createTasks", registry)).toBe(true);
    expect(isWriteTool("updateTasks", registry)).toBe(true);
    expect(isWriteTool("createColumns", registry)).toBe(true);
  });

  test("returns true for destructive category tools", () => {
    expect(isWriteTool("deleteTasks", registry)).toBe(true);
    expect(isWriteTool("deleteColumns", registry)).toBe(true);
  });

  test("returns true for projectCreation category tools", () => {
    expect(isWriteTool("proposeProject", registry)).toBe(true);
  });

  test("returns false for query category tools", () => {
    expect(isWriteTool("getTask", registry)).toBe(false);
    expect(isWriteTool("queryTasks", registry)).toBe(false);
    expect(isWriteTool("queryProject", registry)).toBe(false);
  });

  test("returns false for delegation category tools", () => {
    expect(isWriteTool("delegateToAgent", registry)).toBe(false);
  });

  test("returns false for unknown tool names", () => {
    expect(isWriteTool("unknownTool", registry)).toBe(false);
  });
});

// ─────────────────────────────────────────────
// isDestructiveTool
// ─────────────────────────────────────────────

describe("isDestructiveTool", () => {
  test("returns true for destructive category only", () => {
    expect(isDestructiveTool("deleteTasks", registry)).toBe(true);
    expect(isDestructiveTool("deleteColumns", registry)).toBe(true);
  });

  test("returns false for write category tools", () => {
    expect(isDestructiveTool("createTasks", registry)).toBe(false);
    expect(isDestructiveTool("updateTasks", registry)).toBe(false);
  });

  test("returns false for unknown tool names", () => {
    expect(isDestructiveTool("unknownTool", registry)).toBe(false);
  });
});

// ─────────────────────────────────────────────
// isColumnTool
// ─────────────────────────────────────────────

describe("isColumnTool", () => {
  test("returns true when entity is column", () => {
    expect(isColumnTool("createColumns", registry)).toBe(true);
    expect(isColumnTool("updateColumns", registry)).toBe(true);
    expect(isColumnTool("deleteColumns", registry)).toBe(true);
  });

  test("returns false for non-column entities", () => {
    expect(isColumnTool("createTasks", registry)).toBe(false);
    expect(isColumnTool("queryProject", registry)).toBe(false);
  });

  test("returns false for unknown tool names", () => {
    expect(isColumnTool("unknownTool", registry)).toBe(false);
  });
});

// ─────────────────────────────────────────────
// isDelegationTool
// ─────────────────────────────────────────────

describe("isDelegationTool", () => {
  test("returns true for delegation category", () => {
    expect(isDelegationTool("delegateToAgent", registry)).toBe(true);
  });

  test("returns false for non-delegation tools", () => {
    expect(isDelegationTool("createTasks", registry)).toBe(false);
    expect(isDelegationTool("deleteTasks", registry)).toBe(false);
  });

  test("returns false for unknown tool names", () => {
    expect(isDelegationTool("unknownTool", registry)).toBe(false);
  });
});

// ─────────────────────────────────────────────
// isProjectCreationTool
// ─────────────────────────────────────────────

describe("isProjectCreationTool", () => {
  test("returns true for projectCreation category", () => {
    expect(isProjectCreationTool("proposeProject", registry)).toBe(true);
    expect(isProjectCreationTool("createProjectFromProposal", registry)).toBe(
      true,
    );
  });

  test("returns false for other categories", () => {
    expect(isProjectCreationTool("createTasks", registry)).toBe(false);
    expect(isProjectCreationTool("delegateToAgent", registry)).toBe(false);
  });

  test("returns false for unknown tool names", () => {
    expect(isProjectCreationTool("unknownTool", registry)).toBe(false);
  });
});
