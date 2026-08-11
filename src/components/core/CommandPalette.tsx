import { CommandPalette as CommandPaletteShell } from "@omnidotdev/thornberry/command-palette";
import { hotkeyLabel } from "@omnidotdev/thornberry/use-hotkeys";
import { FolderPlusIcon, PlusIcon, SunMoonIcon } from "lucide-react";

import { Hotkeys } from "@/lib/constants/hotkeys";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import { useTheme } from "@/providers/ThemeProvider";

import type { CommandAction } from "@omnidotdev/thornberry/command-palette";

/**
 * Global command palette (⌘K). Surfaces Runa's primary actions with their
 * keyboard shortcuts, so the app stays keyboard-driven and discoverable. Built
 * on the shared thornberry palette; Runa supplies only its own actions.
 */
const CommandPalette = () => {
  const { theme, setTheme } = useTheme();
  const { setIsOpen: setCreateTaskOpen } = useDialogStore({
    type: DialogType.CreateTask,
  });
  const { setIsOpen: setCreateProjectOpen } = useDialogStore({
    type: DialogType.CreateProject,
  });

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
      group: "General",
      icon: SunMoonIcon,
      shortcut: hotkeyLabel(Hotkeys.ToggleTheme),
      onSelect: () => setTheme(theme === "dark" ? "light" : "dark"),
    },
  ];

  return (
    <CommandPaletteShell
      commands={commands}
      triggerKey={Hotkeys.CommandPalette}
      placeholder="Type a command or search..."
    />
  );
};

export default CommandPalette;
