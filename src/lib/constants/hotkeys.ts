export enum Hotkeys {
  CommandPalette = "mod+k",
  // NB: react-hotkeys-hook matches the physical key code, so `?` is `shift+slash`.
  ShowShortcuts = "shift+slash",
  ToggleSidebar = "b",
  ToggleTheme = "t",
  ToggleViewMode = "v",
  CreateTask = "c",
  CreateProject = "p",
  ToggleFilter = "f",
  UpdateAssignees = "a",
  UpdateDueDate = "d",
  UpdateTaskLabels = "l",
  UpdateTaskStatus = "s",
  UpdateTaskPriority = "shift+p",
  ToggleSidebarOptions = "shift+o",
  // TODO: enable once team billing implemented
  // InviteMember = "i",
}
