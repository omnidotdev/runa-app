import { FolderPlusIcon, PlusIcon, SunMoonIcon } from "lucide-react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Hotkeys } from "@/lib/constants/hotkeys";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import { useTheme } from "@/providers/ThemeProvider";
import Shortcut from "./Shortcut";

/**
 * Global command palette (⌘K). Surfaces Runa's primary actions with their
 * keyboard shortcuts, so the app stays keyboard-driven and discoverable.
 * Mounted once at the root.
 */
const CommandPalette = () => {
  const [open, setOpen] = useState(false);

  const { theme, setTheme } = useTheme();
  const { setIsOpen: setCreateTaskOpen } = useDialogStore({
    type: DialogType.CreateTask,
  });
  const { setIsOpen: setCreateProjectOpen } = useDialogStore({
    type: DialogType.CreateProject,
  });

  useHotkeys(Hotkeys.CommandPalette, () => setOpen((isOpen) => !isOpen), {
    enableOnFormTags: true,
    preventDefault: true,
  });

  /** Run an action, closing the palette first. */
  const run = (action: () => void) => () => {
    setOpen(false);
    action();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={({ open: isOpen }) => setOpen(isOpen)}
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Create">
          <CommandItem onSelect={run(() => setCreateTaskOpen(true))}>
            <PlusIcon />
            Create task
            <Shortcut>{Hotkeys.CreateTask}</Shortcut>
          </CommandItem>
          <CommandItem onSelect={run(() => setCreateProjectOpen(true))}>
            <FolderPlusIcon />
            Create project
            <Shortcut>{Hotkeys.CreateProject}</Shortcut>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="General">
          <CommandItem
            onSelect={run(() => setTheme(theme === "dark" ? "light" : "dark"))}
          >
            <SunMoonIcon />
            Toggle theme
            <Shortcut>{Hotkeys.ToggleTheme}</Shortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
