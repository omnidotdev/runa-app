import { describe, expect, test } from "vitest";

import {
  cancelledExecution,
  failedExecution,
  queuedExecution,
  runningExecution,
  succeededExecution,
} from "@/test/helpers/fixtures/taskExecution";
import taskExecutionOptions from "../taskExecution.options";

describe("taskExecutionOptions", () => {
  describe("enabled", () => {
    test("is false when taskId is empty", () => {
      const opts = taskExecutionOptions({
        taskId: "",
        projectId: "proj-1",
        accessToken: "token",
      });
      expect(opts.enabled).toBe(false);
    });

    test("is false when projectId is empty", () => {
      const opts = taskExecutionOptions({
        taskId: "task-1",
        projectId: "",
        accessToken: "token",
      });
      expect(opts.enabled).toBe(false);
    });

    test("is false when accessToken is empty", () => {
      const opts = taskExecutionOptions({
        taskId: "task-1",
        projectId: "proj-1",
        accessToken: "",
      });
      expect(opts.enabled).toBe(false);
    });

    test("is true when all params provided", () => {
      const opts = taskExecutionOptions({
        taskId: "task-1",
        projectId: "proj-1",
        accessToken: "token",
      });
      expect(opts.enabled).toBe(true);
    });
  });

  describe("refetchInterval", () => {
    const opts = taskExecutionOptions({
      taskId: "task-1",
      projectId: "proj-1",
      accessToken: "token",
    });

    // The refetchInterval is a function - we need to simulate query state
    const createQueryState = (executions: (typeof queuedExecution)[]) => ({
      state: {
        data: { executions },
      },
    });

    test("returns 3000 when execution is queued", () => {
      const interval = (opts.refetchInterval as Function)(
        createQueryState([queuedExecution]),
      );
      expect(interval).toBe(3000);
    });

    test("returns 3000 when execution is running", () => {
      const interval = (opts.refetchInterval as Function)(
        createQueryState([runningExecution]),
      );
      expect(interval).toBe(3000);
    });

    test("returns false when all executions are terminal (succeeded)", () => {
      const interval = (opts.refetchInterval as Function)(
        createQueryState([succeededExecution]),
      );
      expect(interval).toBe(false);
    });

    test("returns false when all executions are terminal (failed)", () => {
      const interval = (opts.refetchInterval as Function)(
        createQueryState([failedExecution]),
      );
      expect(interval).toBe(false);
    });

    test("returns false when all executions are terminal (cancelled)", () => {
      const interval = (opts.refetchInterval as Function)(
        createQueryState([cancelledExecution]),
      );
      expect(interval).toBe(false);
    });

    test("returns false when data is null", () => {
      const interval = (opts.refetchInterval as Function)({
        state: { data: null },
      });
      expect(interval).toBe(false);
    });

    test("returns 3000 if any execution is active among terminal ones", () => {
      const interval = (opts.refetchInterval as Function)(
        createQueryState([succeededExecution, runningExecution]),
      );
      expect(interval).toBe(3000);
    });
  });
});
