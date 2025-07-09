import { useHotkeys } from "react-hotkeys-hook";

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
import useTaskStore from "@/lib/hooks/store/useTaskStore";

const UpdateTaskLabelsDialog = () => {
  const { setTaskId } = useTaskStore();

  const { isOpen, setIsOpen } = useDialogStore({
    type: DialogType.UpdateTaskLabels,
  });

  useHotkeys(Hotkeys.UpdateTaskLabels, () => setIsOpen(true), [setIsOpen]);

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={({ open }) => {
        setIsOpen(open);

        if (!open) {
          setTaskId(null);
        }
      }}
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />
          <DialogTitle>Update Labels</DialogTitle>
          <DialogDescription>
            Update the labels for this task.
          </DialogDescription>

          <div>TODO: implementation</div>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default UpdateTaskLabelsDialog;
