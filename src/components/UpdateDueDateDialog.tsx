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

const UpdateDueDateDialog = () => {
  const { setTaskId } = useTaskStore();

  const { isOpen, setIsOpen } = useDialogStore({
    type: DialogType.UpdateDueDate,
  });

  useHotkeys(Hotkeys.UpdateDueDate, () => setIsOpen(true), [setIsOpen]);

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
          <DialogTitle>Update Due Date</DialogTitle>
          <DialogDescription>
            Update the due date of this task.
          </DialogDescription>

          <div>TODO: implementation</div>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default UpdateDueDateDialog;
