import { useQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useRouteContext,
} from "@tanstack/react-router";
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
  useCreateUserPreferenceMutation,
} from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useProjectStore from "@/lib/hooks/store/useProjectStore";
import useForm from "@/lib/hooks/useForm";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import workspaceOptions from "@/lib/options/workspace.options";
import generateSlug from "@/lib/util/generateSlug";

const DEFAULT_COLUMNS = [
  { title: "Backlog", index: 0, emoji: "📚" },
  { title: "To Do", index: 1, emoji: "📝" },
  { title: "In Progress", index: 2, emoji: "🚧" },
  { title: "Awaiting Review", index: 3, emoji: "👀" },
  { title: "Done", index: 4, emoji: "✅" },
];

const CreateProjectDialog = () => {
  const { session } = useRouteContext({ from: "/_auth" });
  const { workspaceId } = useLoaderData({ from: "/_auth" });
  const { workspaceSlug } = useParams({ strict: false });

  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);

  const { projectColumnId, setProjectColumnId } = useProjectStore();

  const { data: currentWorkspace } = useQuery({
    ...workspaceOptions({
      rowId: workspaceId!,
      userId: session?.user?.rowId!,
    }),
    enabled: !!workspaceId,
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
  const { mutateAsync: createUserPreference } =
    useCreateUserPreferenceMutation();

  const { mutateAsync: createNewProject } = useCreateProjectMutation({
    meta: {
      invalidates: [
        ["Projects"],
        workspaceOptions({
          rowId: workspaceId!,
          userId: session?.user?.rowId!,
        }).queryKey,
        projectColumnsOptions({ workspaceId: workspaceId! }).queryKey,
      ],
    },
    onSuccess: async ({ createProject }) => {
      await Promise.all([
        ...DEFAULT_COLUMNS.map((column) =>
          createColumn({
            input: {
              column: {
                title: column.title,
                index: column.index,
                projectId: createProject?.project?.rowId!,
                emoji: column.emoji,
              },
            },
          }),
        ),
        createUserPreference({
          input: {
            userPreference: {
              projectId: createProject?.project?.rowId!,
              userId: session?.user?.rowId!,
            },
          },
        }),
      ]);

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
      projectColumnId:
        projectColumnId ?? currentWorkspace?.projectColumns?.nodes[0].rowId,
    },
    onSubmit: async ({ value, formApi }) => {
      await createNewProject({
        input: {
          project: {
            workspaceId: workspaceId!,
            name: value.name,
            slug: generateSlug(value.name),
            description: value.description,
            projectColumnId: value.projectColumnId!,
          },
        },
      });

      setIsCreateProjectOpen(false);
      setProjectColumnId(null);
      formApi.reset();
    },
  });

  return (
    <DialogRoot
      open={isCreateProjectOpen}
      onOpenChange={({ open }) => {
        setIsCreateProjectOpen(open);

        if (!open) {
          setProjectColumnId(null);
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
            onSubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await form.handleSubmit();
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
