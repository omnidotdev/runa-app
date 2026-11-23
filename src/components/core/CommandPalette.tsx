import { CommandPalette as CommandPaletteShell } from "@omnidotdev/thornberry/command-palette";
import { ShortcutsDialog } from "@omnidotdev/thornberry/shortcuts-dialog";
import {
  GLOBAL_HOTKEYS,
  hotkeyLabel,
} from "@omnidotdev/thornberry/use-hotkeys";
import {
  FolderPlusIcon,
  KeyboardIcon,
  PlusIcon,
  SunMoonIcon,
} from "lucide-react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Hotkeys } from "@/lib/constants/hotkeys";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import { useTheme } from "@/providers/ThemeProvider";

import type { CommandAction } from "@omnidotdev/thornberry/command-palette";
import type { ShortcutGroup } from "@omnidotdev/thornberry/shortcuts-dialog";

/** Runa's own bindings, listed in the shortcuts dialog after the global keys */
const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: "Board",
    shortcuts: [
      { keys: Hotkeys.ToggleViewMode, label: "Switch board/list view" },
      { keys: Hotkeys.ToggleFilter, label: "Toggle filters" },
      { keys: Hotkeys.CreateProject, label: "New project" },
      { keys: Hotkeys.CreateTask, label: "New task" },
    ],
  },
  {
    title: "Task",
    hint: "Hover a card, then press:",
    shortcuts: [
      { keys: Hotkeys.UpdateAssignees, label: "Assign members" },
      { keys: Hotkeys.UpdateTaskLabels, label: "Edit labels" },
      { keys: Hotkeys.UpdateDueDate, label: "Set due date" },
      { keys: Hotkeys.UpdateTaskStatus, label: "Change status" },
      { keys: Hotkeys.UpdateTaskPriority, label: "Change priority" },
    ],
  },
];

/**
 * Global command palette (⌘K). Surfaces Runa's primary actions with their
 * keyboard shortcuts, so the app stays keyboard-driven and discoverable. Built
 * on the shared thornberry palette; Runa supplies only its own actions. Also
 * owns the app-wide theme key and the `?` shortcuts list
 */
const CommandPalette = () => {
  const { theme, setTheme } = useTheme();
  const { setIsOpen: setCreateTaskOpen } = useDialogStore({
    type: DialogType.CreateTask,
  });
  const { setIsOpen: setCreateProjectOpen } = useDialogStore({
    type: DialogType.CreateProject,
  });

  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // App-wide theme shortcut. react-hotkeys-hook ignores form fields by default,
  // so typing `t` in an input never flips the theme
  useHotkeys(GLOBAL_HOTKEYS.toggleTheme, toggleTheme, [theme]);

  const commands: CommandAction[] = [
    {
      id: "create-task",
      label: "Create task",
      group: "Create",
      icon: PlusIcon,
      shortcut: hotkeyLabel(Hotkeys.CreateTask),
      onSelect: () => setCreateTaskOpen(true),
    },
    {
      id: "create-project",
      label: "Create project",
      group: "Create",
      icon: FolderPlusIcon,
      shortcut: hotkeyLabel(Hotkeys.CreateProject),
      onSelect: () => setCreateProjectOpen(true),
    },
    {
      id: "toggle-theme",
      label: "Toggle theme",
      group: "Preferences",
      icon: SunMoonIcon,
      shortcut: hotkeyLabel(GLOBAL_HOTKEYS.toggleTheme),
      onSelect: toggleTheme,
    },
    {
      id: "keyboard-shortcuts",
      label: "Keyboard shortcuts",
      group: "Preferences",
      icon: KeyboardIcon,
      keywords: ["hotkeys", "keys", "help"],
      shortcut: hotkeyLabel(GLOBAL_HOTKEYS.showShortcuts),
      onSelect: () => setShortcutsOpen(true),
    },
  ];

  return (
    <>
      <CommandPaletteShell
        commands={commands}
        triggerKey={GLOBAL_HOTKEYS.commandPalette}
        placeholder="Type a command or search..."
      />
      {/* `?` opens it anywhere; the palette entry opens it too */}
      <ShortcutsDialog
        globals={[
          "commandPalette",
          "showShortcuts",
          "toggleSidebar",
          "toggleTheme",
        ]}
        general={[
          {
            keys: Hotkeys.ToggleSidebarOptions,
            label: "Toggle sidebar options",
          },
        ]}
        groups={SHORTCUT_GROUPS}
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
      />
    </>
  );
};

export default CommandPalette;
