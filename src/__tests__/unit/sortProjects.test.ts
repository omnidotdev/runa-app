import { describe, expect, it } from "bun:test";

import sortProjects from "@/lib/util/sortProjects";

import type { ProjectsSidebarQuery } from "@/generated/graphql";

type SidebarProject = NonNullable<
  ProjectsSidebarQuery["projects"]
>["nodes"][number];

const makeProject = (
  name: string,
  pinOrder?: number | null,
): SidebarProject => ({
  __typename: "Project",
  rowId: crypto.randomUUID(),
  name,
  slug: name.toLowerCase().replaceAll(" ", "-"),
  color: null,
  userPreferences: {
    __typename: "UserPreferenceConnection",
    nodes:
      pinOrder !== undefined
        ? [
            {
              __typename: "UserPreference",
              rowId: crypto.randomUUID(),
              viewMode: "board",
              pinOrder,
            },
          ]
        : [],
  },
});

describe("sortProjects", () => {
  it("sorts unpinned projects alphabetically", () => {
    const projects = [
      makeProject("Zebra"),
      makeProject("Alpha"),
      makeProject("Mango"),
    ];

    const sorted = sortProjects(projects);

    expect(sorted.map((p) => p.name)).toEqual(["Alpha", "Mango", "Zebra"]);
  });

  it("places pinned projects before unpinned", () => {
    const projects = [makeProject("Unpinned"), makeProject("Pinned", 0)];

    const sorted = sortProjects(projects);

    expect(sorted.map((p) => p.name)).toEqual(["Pinned", "Unpinned"]);
  });

  it("sorts pinned projects by pinOrder ascending", () => {
    const projects = [
      makeProject("Second", 2),
      makeProject("First", 0),
      makeProject("Third", 5),
    ];

    const sorted = sortProjects(projects);

    expect(sorted.map((p) => p.name)).toEqual(["First", "Second", "Third"]);
  });

  it("sorts pinned by order then unpinned alphabetically", () => {
    const projects = [
      makeProject("Zebra"),
      makeProject("Beta", 1),
      makeProject("Alpha"),
      makeProject("Gamma", 0),
    ];

    const sorted = sortProjects(projects);

    expect(sorted.map((p) => p.name)).toEqual([
      "Gamma",
      "Beta",
      "Alpha",
      "Zebra",
    ]);
  });

  it("treats null pinOrder as unpinned", () => {
    const projects = [
      makeProject("Pinned", 0),
      makeProject("Null Pin", null),
      makeProject("Alpha"),
    ];

    const sorted = sortProjects(projects);

    expect(sorted.map((p) => p.name)).toEqual(["Pinned", "Alpha", "Null Pin"]);
  });

  it("treats missing userPreferences as unpinned", () => {
    const projects = [makeProject("No Prefs"), makeProject("Pinned", 0)];
    // Remove userPreferences entirely
    projects[0]!.userPreferences = {
      __typename: "UserPreferenceConnection",
      nodes: [],
    };

    const sorted = sortProjects(projects);

    expect(sorted.map((p) => p.name)).toEqual(["Pinned", "No Prefs"]);
  });

  it("is case-insensitive when sorting alphabetically", () => {
    const projects = [
      makeProject("banana"),
      makeProject("Apple"),
      makeProject("cherry"),
    ];

    const sorted = sortProjects(projects);

    expect(sorted.map((p) => p.name)).toEqual(["Apple", "banana", "cherry"]);
  });

  it("returns empty array for empty input", () => {
    expect(sortProjects([])).toEqual([]);
  });

  it("does not mutate the original array", () => {
    const projects = [makeProject("B"), makeProject("A")];
    const original = [...projects];

    sortProjects(projects);

    expect(projects.map((p) => p.name)).toEqual(original.map((p) => p.name));
  });
});
