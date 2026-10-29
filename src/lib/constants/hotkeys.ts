import { GLOBAL_HOTKEYS } from "@omnidotdev/thornberry/use-hotkeys";

/**
 * Runa keyboard bindings. The shared bindings (command palette, theme toggle)
 * are sourced from thornberry's `GLOBAL_HOTKEYS` so they stay normalized across
 * the fleet; the rest are Runa-specific.
 */
export const Hotkeys = {
  CommandPalette: GLOBAL_HOTKEYS.commandPalette,
  ToggleTheme: GLOBAL_HOTKEYS.toggleTheme,
  // NB: react-hotkeys-hook matches the physical key code, so `?` is `shift+slash`
  ShowShortcuts: "shift+slash",
  ToggleSidebar: "b",
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
