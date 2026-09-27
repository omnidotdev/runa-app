import { describe, expect, it } from "bun:test";

import groupActivity from "@/lib/util/groupActivity";

const entry = (
  id: string,
  action: string,
  actorName: string | null,
  relativeTime: string,
) => ({ id, action, actorName, relativeTime, occurredAt: id });

describe("groupActivity", () => {
  it("collapses consecutive same-actor, same-action runs into one row with a count", () => {
    const groups = groupActivity([
      entry("a", "task.updated", "Brian", "2 hours ago"),
      entry("b", "task.updated", "Brian", "2 hours ago"),
      entry("c", "task.updated", "Brian", "3 hours ago"),
      entry("d", "post.created", "Brian", "1 day ago"),
    ]);

    expect(groups).toHaveLength(2);
    expect(groups[0]).toMatchObject({
      actorName: "Brian",
      verb: "updated this task",
      count: 3,
      relativeTime: "2 hours ago", // newest in the run
    });
    expect(groups[1]).toMatchObject({ verb: "commented", count: 1 });
  });

  it("maps assign/unassign and label add/remove to a single friendly verb, so a run of them collapses", () => {
    const groups = groupActivity([
      entry("a", "assignee.created", "Brian", "now"),
      entry("b", "assignee.deleted", "Brian", "now"),
      entry("c", "task_label.created", "Brian", "1h"),
    ]);
    expect(groups).toHaveLength(2);
    expect(groups[0].verb).toBe("changed assignees");
    expect(groups[0].count).toBe(2);
    expect(groups[1].verb).toBe("changed labels");
  });

  it("does not merge across different actors", () => {
    const groups = groupActivity([
      entry("a", "task.updated", "Brian", "now"),
      entry("b", "task.updated", "Alice", "now"),
    ]);
    expect(groups).toHaveLength(2);
  });

  it("falls back to a generic verb for unknown actions", () => {
    const groups = groupActivity([entry("a", "task.created", "Brian", "now")]);
    expect(groups[0].verb).toBe("created this task");
    const unknown = groupActivity([entry("z", "widget.frobbed", "X", "now")]);
    expect(unknown[0].verb).toBe("updated this task");
  });

  it("returns an empty array for no entries", () => {
    expect(groupActivity([])).toEqual([]);
  });

  it("prefers field-level detail as the verb and collapses repeats of it", () => {
    const groups = groupActivity([
      {
        id: "a",
        action: "task.updated",
        actorName: "Brian",
        detail: "edited the description",
        relativeTime: "now",
      },
      {
        id: "b",
        action: "task.updated",
        actorName: "Brian",
        detail: "edited the description",
        relativeTime: "1m",
      },
      {
        id: "c",
        action: "task.updated",
        actorName: "Brian",
        detail: "moved this task to Done",
        relativeTime: "2m",
      },
    ]);
    expect(groups).toHaveLength(2);
    expect(groups[0]).toMatchObject({
      verb: "edited the description",
      count: 2,
    });
    expect(groups[1]).toMatchObject({
      verb: "moved this task to Done",
      count: 1,
    });
  });
});
