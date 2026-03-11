import { describe, expect, test } from "vitest";

import { formatToolName } from "../formatToolName";

describe("formatToolName", () => {
  test("converts createTasks to Create Tasks", () => {
    expect(formatToolName("createTasks")).toBe("Create Tasks");
  });

  test("converts queryProject to Query Project", () => {
    expect(formatToolName("queryProject")).toBe("Query Project");
  });

  test("converts deleteTasks to Delete Tasks", () => {
    expect(formatToolName("deleteTasks")).toBe("Delete Tasks");
  });

  test("converts delegateToAgent to Delegate To Agent", () => {
    expect(formatToolName("delegateToAgent")).toBe("Delegate To Agent");
  });

  test("handles single word", () => {
    expect(formatToolName("query")).toBe("Query");
  });

  test("handles empty string", () => {
    expect(formatToolName("")).toBe("");
  });

  test("converts getTask to Get Task", () => {
    expect(formatToolName("getTask")).toBe("Get Task");
  });

  test("converts updateColumns to Update Columns", () => {
    expect(formatToolName("updateColumns")).toBe("Update Columns");
  });

  test("converts createPullRequest to Create Pull Request", () => {
    expect(formatToolName("createPullRequest")).toBe("Create Pull Request");
  });
});
