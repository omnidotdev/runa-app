/**
 * Runa-specific keyboard bindings. The shared bindings (command palette, theme,
 * sidebar, shortcuts list) live in thornberry's `GLOBAL_HOTKEYS` so they stay
 * normalized across the fleet
 */
export const Hotkeys = {
  ToggleViewMode: "v",
  CreateTask: "c",
  CreateProject: "p",
  ToggleFilter: "f",
  UpdateAssignees: "a",
  UpdateDueDate: "d",
  UpdateTaskLabels: "l",
  UpdateTaskStatus: "s",
  UpdateTaskPriority: "shift+p",
  ToggleSidebarOptions: "shift+o",
  // TODO: enable once team billing implemented
  // InviteMember: "i",
} as const;

export type Hotkeys = (typeof Hotkeys)[keyof typeof Hotkeys];
