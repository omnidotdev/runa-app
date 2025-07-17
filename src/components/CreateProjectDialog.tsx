import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

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
import { Hotkeys } from "@/lib/constants/hotkeys";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useProjectStore from "@/lib/hooks/store/useProjectStore";
import useForm from "@/lib/hooks/useForm";
import workspaceOptions from "@/lib/options/workspace.options";
import workspaceBySlugOptions from "@/lib/options/workspaceBySlug.options";
import generateSlug from "@/lib/util/generateSlug";

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
  const { workspaceSlug } = useParams({ strict: false });

  const { data: workspace } = useQuery({
    ...workspaceBySlugOptions({ slug: workspaceSlug! }),
    enabled: !!workspaceSlug,
    select: (data) => data?.workspaceBySlug,
  });

  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);

  const { setStatus } = useProjectStore();

  const { data: currentWorkspace } = useQuery({
    ...workspaceOptions({ rowId: workspace?.rowId! }),
    enabled: !!workspace?.rowId,
    select: (data) => data?.workspace,
  });

  const { isOpen: isCreateProjectOpen, setIsOpen: setIsCreateProjectOpen } =
    useDialogStore({
      type: DialogType.CreateProject,
    });

  useHotkeys(
    Hotkeys.CreateProject,
    () => setIsCreateProjectOpen(!isCreateProjectOpen),
    [setIsCreateProjectOpen, isCreateProjectOpen],
  );

  const { mutateAsync: createColumn } = useCreateColumnMutation();

  const { mutate: createNewProject } = useCreateProjectMutation({
    meta: {
      invalidates: [
        ["Projects"],
        workspaceOptions({ rowId: workspace?.rowId! }).queryKey,
      ],
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
        to: "/workspaces/$workspaceSlug/projects/$projectSlug",
        params: {
          workspaceSlug: workspaceSlug!,
          projectSlug: createProject?.project?.slug!,
        },
      });
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      status: status ?? undefined,
    },
    onSubmit: async ({ value, formApi }) => {
      createNewProject({
        input: {
          project: {
            workspaceId: workspace?.rowId!,
            name: value.name,
            slug: generateSlug(value.name),
            description: value.description,
            status: value.status,
          },
        },
      });

      setIsCreateProjectOpen(false);
      setStatus(null);
      formApi.reset();
    },
  });

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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-2"
          >
            <form.Field name="name">
              {(field) => (
                <Input
                  ref={nameRef}
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Project Name"
                />
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Project Description (optional)"
                  className="field-sizing-content flex min-h-16 w-full rounded-md border border-input px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40"
                />
              )}
            </form.Field>

            <div className="mt-2 flex justify-end gap-2">
              <Button
                onClick={() => {
                  setIsCreateProjectOpen(false);
                  form.reset();
                }}
                variant="ghost"
              >
                Cancel
              </Button>

              <form.Subscribe
                selector={(state) => [
                  state.canSubmit,
                  state.isSubmitting,
                  state.isDirty,
                ]}
              >
                {([canSubmit, isSubmitting, isDirty]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting || !isDirty}
                  >
                    Create
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default CreateProjectDialog;
