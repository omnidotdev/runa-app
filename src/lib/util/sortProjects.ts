import type { ProjectsSidebarQuery } from "@/generated/graphql";

type SidebarProject = NonNullable<
  ProjectsSidebarQuery["projects"]
>["nodes"][number];

/**
 * Sort projects by pin status, then pin order, then alphabetically.
 * Pinned projects (pinOrder != null) come first, sorted by pinOrder ascending.
 * Unpinned projects are sorted alphabetically by name.
 * @param projects - Array of sidebar projects to sort.
 * @returns Sorted copy of the array.
 */
const sortProjects = (projects: SidebarProject[]): SidebarProject[] =>
  [...projects].sort((a, b) => {
    const aPin = a.userPreferences?.nodes?.[0]?.pinOrder;
    const bPin = b.userPreferences?.nodes?.[0]?.pinOrder;
    const aPinned = aPin != null;
    const bPinned = bPin != null;

    if (aPinned !== bPinned) return aPinned ? -1 : 1;
    if (aPinned && bPinned) return (aPin ?? 0) - (bPin ?? 0);

    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });

export default sortProjects;
