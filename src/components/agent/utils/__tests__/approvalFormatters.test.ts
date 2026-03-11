import { describe, expect, test } from "vitest";

import { mockToolRegistry } from "@/test/helpers/fixtures/toolRegistry";
import {
  extractActionVerb,
  extractCount,
  formatApprovalDetails,
  formatTaskRef,
} from "../approvalFormatters";

// ─────────────────────────────────────────────
// extractActionVerb
// ─────────────────────────────────────────────

describe("extractActionVerb", () => {
  test("returns Create for createTasks", () => {
    expect(extractActionVerb("createTasks")).toBe("Create");
  });

  test("returns Delete for deleteTasks", () => {
    expect(extractActionVerb("deleteTasks")).toBe("Delete");
  });

  test("returns Update for updateTasks", () => {
    expect(extractActionVerb("updateTasks")).toBe("Update");
  });

  test("returns Execute for unknown tool", () => {
    expect(extractActionVerb("unknownTool")).toBe("Execute");
  });

  test("returns Move for moveTasks", () => {
    expect(extractActionVerb("moveTasks")).toBe("Move");
  });

  test("returns Reorder for reorderColumns", () => {
    expect(extractActionVerb("reorderColumns")).toBe("Reorder");
  });
});

// ─────────────────────────────────────────────
// extractCount
// ─────────────────────────────────────────────

describe("extractCount", () => {
  test("returns array length from tasks field", () => {
    expect(extractCount({ tasks: [{}, {}] })).toBe(2);
  });

  test("returns array length from updates field", () => {
    expect(extractCount({ updates: [{}, {}, {}] })).toBe(3);
  });

  test("returns 1 for null input", () => {
    expect(extractCount(null)).toBe(1);
  });

  test("returns 1 for non-object input", () => {
    expect(extractCount("string")).toBe(1);
  });

  test("returns 1 when no known array fields exist", () => {
    expect(extractCount({ someField: "value" })).toBe(1);
  });
});

// ─────────────────────────────────────────────
// formatTaskRef
// ─────────────────────────────────────────────

describe("formatTaskRef", () => {
  test("formats with taskNumber and prefix", () => {
    expect(formatTaskRef({ taskNumber: 42 }, "PROJ")).toBe("PROJ-42");
  });

  test("returns taskId when taskNumber is absent", () => {
    expect(formatTaskRef({ taskId: "abc-123" }, "T")).toBe("abc-123");
  });

  test("returns undefined for null input", () => {
    expect(formatTaskRef(null, "T")).toBeUndefined();
  });

  test("returns undefined for non-object input", () => {
    expect(formatTaskRef("string", "T")).toBeUndefined();
  });

  test("returns undefined when neither taskNumber nor taskId exists", () => {
    expect(formatTaskRef({ title: "test" }, "T")).toBeUndefined();
  });
});

// ─────────────────────────────────────────────
// formatApprovalDetails
// ─────────────────────────────────────────────

describe("formatApprovalDetails", () => {
  const registry = mockToolRegistry;

  test("returns fallback for unknown tool", () => {
    expect(formatApprovalDetails("unknownTool", {}, registry)).toBe(
      "Execute this operation?",
    );
  });

  // Destructive
  test("formats destructive task deletion with count", () => {
    const input = { tasks: [{ taskNumber: 1 }, { taskNumber: 2 }] };
    expect(formatApprovalDetails("deleteTasks", input, registry)).toBe(
      "Permanently delete 2 tasks?",
    );
  });

  test("formats single destructive task deletion with reference", () => {
    const input = { tasks: [{ taskNumber: 42 }] };
    expect(formatApprovalDetails("deleteTasks", input, registry, "PROJ")).toBe(
      "Permanently delete task PROJ-42?",
    );
  });

  test("formats destructive column deletion", () => {
    expect(formatApprovalDetails("deleteColumns", {}, registry)).toBe(
      "Permanently delete this column?",
    );
  });

  // Write
  test("formats single task creation with title", () => {
    const input = { tasks: [{ title: "Fix auth bug" }] };
    expect(formatApprovalDetails("createTasks", input, registry)).toBe(
      'Create task: "Fix auth bug"?',
    );
  });

  test("formats multiple task creation", () => {
    const input = { tasks: [{}, {}] };
    expect(formatApprovalDetails("createTasks", input, registry)).toBe(
      "Create 2 tasks?",
    );
  });

  test("formats task update", () => {
    const input = { updates: [{}] };
    expect(formatApprovalDetails("updateTasks", input, registry)).toBe(
      "Update 1 task?",
    );
  });

  test("formats column write", () => {
    expect(formatApprovalDetails("createColumns", {}, registry)).toBe(
      "Create this column?",
    );
  });

  test("formats comment creation", () => {
    const input = { comments: [{ content: "test" }] };
    // Comments don't have an "assignments" or "tasks" field, so count is 1
    expect(formatApprovalDetails("createComments", input, registry)).toBe(
      "Add 1 comment?",
    );
  });

  // Special categories
  test("formats project creation", () => {
    expect(formatApprovalDetails("proposeProject", {}, registry)).toBe(
      "Create this project?",
    );
  });

  test("formats delegation", () => {
    expect(formatApprovalDetails("delegateToAgent", {}, registry)).toBe(
      "Delegate this task?",
    );
  });
});
