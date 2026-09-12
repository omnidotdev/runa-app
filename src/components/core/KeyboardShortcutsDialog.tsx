import { hotkeyLabel } from "@omnidotdev/thornberry/use-hotkeys";
import { useHotkeys } from "react-hotkeys-hook";

import Shortcut from "@/components/core/Shortcut";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Hotkeys } from "@/lib/constants/hotkeys";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";

interface ShortcutItem {
  /** Hotkey binding (matches the `Hotkeys` enum). */
  keys: Hotkeys;
  /** What the shortcut does. */
  label: string;
}

interface ShortcutGroup {
  /** Section heading. */
  title: string;
  /** Optional hint shown under the heading (e.g. how to target a card). */
  hint?: string;
  shortcuts: ShortcutItem[];
}

// NB: `?` is `shift+/`; hotkeyLabel renders it literally, so show the glyph.
const displayLabel = (keys: Hotkeys) =>
  keys === Hotkeys.ShowShortcuts ? "?" : hotkeyLabel(keys);

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: "General",
    shortcuts: [
      { keys: Hotkeys.CommandPalette, label: "Open command palette" },
      { keys: Hotkeys.ShowShortcuts, label: "Show keyboard shortcuts" },
      { keys: Hotkeys.ToggleSidebar, label: "Toggle sidebar" },
      { keys: Hotkeys.ToggleSidebarOptions, label: "Toggle sidebar options" },
      { keys: Hotkeys.ToggleTheme, label: "Toggle light/dark theme" },
    ],
  },
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
 * Global keyboard-shortcuts reference, opened with `?`. Driven by the `Hotkeys`
 * enum so it stays in sync with the actual bindings, and the single place a user
 * can discover the full set (the card A/L/D actions in particular have no visible
 * trigger until their data exists).
 */
const KeyboardShortcutsDialog = () => {
  const { isOpen, setIsOpen } = useDialogStore({
    type: DialogType.KeyboardShortcuts,
  });

  useHotkeys(
    Hotkeys.ShowShortcuts,
    () => setIsOpen(!isOpen),
    { description: "Show keyboard shortcuts" },
    [isOpen],
  );

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
      lazyMount
      unmountOnExit
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />

          <div className="flex flex-col gap-1">
            <DialogTitle>Keyboard shortcuts</DialogTitle>
            <DialogDescription>
              Press <Shortcut>?</Shortcut> anytime to open this list.
            </DialogDescription>
          </div>

          <div className="flex flex-col gap-5">
            {SHORTCUT_GROUPS.map((group) => (
              <div key={group.title} className="flex flex-col gap-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-medium text-foreground text-sm">
                    {group.title}
                  </h3>
                  {group.hint && (
                    <span className="text-muted-foreground text-xs">
                      {group.hint}
                    </span>
                  )}
                </div>

                <ul className="flex flex-col divide-y divide-border">
                  {group.shortcuts.map((shortcut) => (
                    <li
                      key={shortcut.keys}
                      className="flex items-center justify-between gap-4 py-1.5"
                    >
                      <span className="text-muted-foreground text-sm">
                        {shortcut.label}
                      </span>
                      <Shortcut className="ml-0">
                        {displayLabel(shortcut.keys)}
                      </Shortcut>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default KeyboardShortcutsDialog;
