import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import workspaceOptions from "@/lib/options/workspace.options";

import type { FormEvent } from "react";
import type { Assignee } from "@/types";

interface Props {
  members: Assignee[];
  setMembers: (members: Assignee[]) => void;
}

const CreateMemberDialog = ({ members, setMembers }: Props) => {
  const { workspaceId } = useParams({ strict: false });
  const [newMemberName, setNewMemberName] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  const { isOpen: isCreateMemberOpen, setIsOpen: setIsCreateMemberOpen } =
    useDialogStore({
      type: DialogType.CreateMember,
    });

  const { data: currentWorkspace } = useQuery({
    ...workspaceOptions({ rowId: workspaceId! }),
    enabled: !!workspaceId,
    select: (data) => data?.workspace,
  });

  const handleAddMember = (e: FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMember: Assignee = {
      id: `user-${Date.now()}`,
      name: newMemberName.trim(),
    };

    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    // onUpdate(updatedMembers);
    setNewMemberName("");
  };

  return (
    <DialogRoot
      open={isCreateMemberOpen}
      onOpenChange={({ open }) => setIsCreateMemberOpen(open)}
      initialFocusEl={() => nameRef.current}
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />
          <DialogTitle>Add new member</DialogTitle>
          <DialogDescription>
            Create a new team member for the{" "}
            <strong className="text-primary">{currentWorkspace?.name}</strong>{" "}
            workspace.
          </DialogDescription>

          <form onSubmit={handleAddMember}>
            <div className="flex gap-2">
              <Input
                ref={nameRef}
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Enter member name"
              />

              <Button
                type="submit"
                disabled={!newMemberName.trim()}
                onClick={() => setIsCreateMemberOpen(false)}
              >
                <Plus className="h-4 w-4" />
                Add Member
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default CreateMemberDialog;
