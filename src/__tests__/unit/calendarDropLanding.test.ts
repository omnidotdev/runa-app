import { describe, expect, it } from "bun:test";

import calendarDropLanding from "@/lib/util/calendarDropLanding";

// board order of every task the calendar knows about
const order = ["a", "b", "c", "d", "e", "f"];

describe("calendarDropLanding", () => {
  it("lands at the top of an empty day", () => {
    expect(
      calendarDropLanding({ itemId: "c", destinationIds: [], order }),
    ).toEqual({ index: 0, slot: 0, hidden: false });
  });

  it("lands after tasks that come earlier in board order", () => {
    expect(
      calendarDropLanding({ itemId: "e", destinationIds: ["a", "c"], order }),
    ).toEqual({ index: 2, slot: 2, hidden: false });
  });

  it("lands between tasks by board order, not by where it was dropped", () => {
    expect(
      calendarDropLanding({ itemId: "c", destinationIds: ["a", "e"], order }),
    ).toEqual({ index: 1, slot: 1, hidden: false });
  });

  it("returns a task dropped on its own day to its current spot", () => {
    expect(
      calendarDropLanding({
        itemId: "c",
        destinationIds: ["a", "c", "e"],
        order,
      }),
    ).toEqual({ index: 1, slot: 1, hidden: false });
  });

  it("lands on the +N more row when it sorts past the visible cap", () => {
    expect(
      calendarDropLanding({
        itemId: "f",
        destinationIds: ["a", "b", "c"],
        order,
        maxVisible: 3,
      }),
    ).toEqual({ index: 3, slot: 3, hidden: true });
  });

  it("stays visible when it sorts ahead of the cap on a full day", () => {
    expect(
      calendarDropLanding({
        itemId: "a",
        destinationIds: ["b", "c", "d"],
        order,
        maxVisible: 3,
      }),
    ).toEqual({ index: 0, slot: 0, hidden: false });
  });

  it("never hides on an uncapped list (the rail, or an expanded day)", () => {
    expect(
      calendarDropLanding({
        itemId: "f",
        destinationIds: ["a", "b", "c", "d"],
        order,
        maxVisible: null,
      }),
    ).toEqual({ index: 4, slot: 4, hidden: false });
  });

  it("sorts a task missing from the order after every known task", () => {
    expect(
      calendarDropLanding({
        itemId: "zz",
        destinationIds: ["a", "f"],
        order,
      }),
    ).toEqual({ index: 2, slot: 2, hidden: false });
  });
});
