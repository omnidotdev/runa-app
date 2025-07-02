import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
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
import {
  useCreateColumnMutation,
  useCreateProjectMutation,
} from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useProjectStore from "@/lib/hooks/store/useProjectStore";
import workspaceOptions from "@/lib/options/workspace.options";

import type { ProjectStatus } from "@/generated/graphql";

const DEFAULT_COLUMNS = [
  { title: "Backlog", index: 0 },
  { title: "To Do", index: 1 },
  { title: "In Progress", index: 2 },
  { title: "Awaiting Review", index: 3 },
  { title: "Done", index: 4 },
];

interface Props {
  status?: ProjectStatus;
}

const CreateProjectDialog = ({ status }: Props) => {
  const { workspaceId } = useParams({ strict: false });

  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);

  const { setStatus } = useProjectStore();

  const { data: currentWorkspace } = useQuery({
    ...workspaceOptions(workspaceId!),
    enabled: !!workspaceId,
    select: (data) => data?.workspace,
  });

  const { isOpen: isCreateProjectOpen, setIsOpen: setIsCreateProjectOpen } =
    useDialogStore({
      type: DialogType.CreateProject,
    });

  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  const { mutateAsync: createColumn } = useCreateColumnMutation();

  const { mutateAsync: createNewProject } = useCreateProjectMutation({
    meta: {
      invalidates: [["Projects"], workspaceOptions(workspaceId!).queryKey],
    },
    onSuccess: async ({ createProject }) => {
      await Promise.all(
        DEFAULT_COLUMNS.map((column) =>
          createColumn({
            input: {
              column: {
                title: column.title,
                index: column.index,
                projectId: createProject?.project?.rowId!,
              },
            },
          }),
        ),
      );

      navigate({
        to: "/workspaces/$workspaceId/projects/$projectId",
        params: {
          workspaceId: workspaceId!,
          projectId: createProject?.project?.rowId!,
        },
      });
    },
  });

  const handleCreateProject = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newProjectName.trim()) return;

    await createNewProject({
      input: {
        project: {
          workspaceId: workspaceId!,
          name: newProjectName,
          status,
        },
      },
    });

    setNewProjectName("");
    setIsCreateProjectOpen(false);
    setStatus(null);
  };

  return (
    <DialogRoot
      open={isCreateProjectOpen}
      onOpenChange={({ open }) => {
        setIsCreateProjectOpen(open);

        if (!open) {
          setStatus(null);
        }
      }}
      initialFocusEl={() => nameRef.current}
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Create a new project for the{" "}
            <strong className="text-primary">{currentWorkspace?.name}</strong>{" "}
            workspace.
          </DialogDescription>

          <form onSubmit={handleCreateProject} className="flex flex-col gap-2">
            <Input
              ref={nameRef}
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name"
            />

            <textarea
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              placeholder="Project description (optional)"
              className="field-sizing-content flex min-h-16 w-full rounded-md border border-input px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40"
            />

            <div className="mt-2 flex justify-end gap-2">
              <Button
                onClick={() => {
                  setNewProjectName("");
                  setNewProjectDescription("");
                  setIsCreateProjectOpen(false);
                }}
                variant="ghost"
              >
                Cancel
              </Button>

              <Button type="submit" disabled={!newProjectName.trim()}>
                Create
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default CreateProjectDialog;
