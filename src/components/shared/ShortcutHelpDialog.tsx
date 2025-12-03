import { InfoIcon } from "lucide-react";

import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip } from "@/components/ui/tooltip";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";

// const shortcuts = [
//   { keys: ["W"], action: "Create Workspace" },
//   { keys: ["P"], action: "Create Project" },
//   // { keys: ["I"], action: "Invite Member" },
//   { keys: ["C"], action: "Create New Task" },
//   { keys: ["A"], action: "Create/Update Assignees" },
//   { keys: ["L"], action: "Create/Update Labels" },
//   { keys: ["D"], action: "Create/Update Due Date" },
//   { keys: ["S"], action: "Create/Update Status" },
//   { keys: ["Shift+P"], action: "Create/Update Priority" },
//   { keys: ["B"], action: "Toggle Sidebar" },
//   { keys: ["T"], action: "Toggle Dark Mode" },
// ];

const shortcuts = [
  {
    category: "Organization",
    items: [
      { keys: ["W"], action: "Create Workspace" },
      { keys: ["P"], action: "Create Project" },
      { keys: ["I"], action: "Invite Member" },
    ],
  },
  {
    category: "Tasks",
    helper:
      "If the shortcut says 'Create/Update', you must be creating a new task, or hovered over an existing task to use it.",
    items: [
      { keys: ["C"], action: "Create New Task" },
      { keys: ["A"], action: "Create/Update Assignees" },
      { keys: ["L"], action: "Create/Update Labels" },
      { keys: ["D"], action: "Create/Update Due Date" },
      { keys: ["S"], action: "Create/Update Status" },
      { keys: ["Shift+P"], action: "Create/Update Priority" },
    ],
  },
  {
    category: "Interface",
    items: [
      { keys: ["B"], action: "Toggle Sidebar" },
      { keys: ["T"], action: "Toggle Dark Mode" },
    ],
  },
];

const ShortcutHelpDialog = () => {
  const { isOpen: isShortcutHelpOpen, setIsOpen: setIsShortcutHelpOpen } =
    useDialogStore({
      type: DialogType.ShortcutHelp,
    });

  return (
    <DialogRoot
      open={isShortcutHelpOpen}
      onOpenChange={({ open }) => {
        setIsShortcutHelpOpen(open);
      }}
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />
          <DialogTitle>Shortcut Help</DialogTitle>
          <div className="space-y-6">
            {shortcuts.map((group) => (
              <div key={group.category}>
                <div className="flex items-center gap-2">
                  <h2 className="font-medium text-foreground">
                    {group.category}
                  </h2>

                  {group.helper && (
                    <Tooltip
                      positioning={{ placement: "right" }}
                      tooltip={group.helper}
                      className="max-w-60 overflow-hidden"
                    >
                      <InfoIcon className="size-3" />
                    </Tooltip>
                  )}
                </div>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item, idx) => (
                    <li
                      // biome-ignore lint/suspicious/noArrayIndexKey: test
                      key={idx}
                      className="flex items-center gap-2 text-neutral-400 text-xs"
                    >
                      <span className="flex gap-1">
                        {item.keys.map((key, i) => (
                          <kbd
                            // biome-ignore lint/suspicious/noArrayIndexKey: test
                            key={i}
                            className="rounded-md border border-neutral-300 bg-neutral-100 px-2 py-1 text-foreground dark:border-neutral-700 dark:bg-neutral-800"
                          >
                            <span className="text-xs"> {key}</span>
                          </kbd>
                        ))}
                      </span>
                      <span>{item.action}</span>
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

export default ShortcutHelpDialog;
