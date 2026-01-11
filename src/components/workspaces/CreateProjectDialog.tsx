import { useQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useRouteContext,
} from "@tanstack/react-router";
import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";

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
  Role,
  useCreateColumnMutation,
  useCreateProjectMutation,
  useCreateUserPreferenceMutation,
  useProjectsQuery,
} from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useProjectStore from "@/lib/hooks/store/useProjectStore";
import useForm from "@/lib/hooks/useForm";
import useMaxProjectsReached from "@/lib/hooks/useMaxProjectsReached";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import projectsOptions from "@/lib/options/projects.options";
import workspaceOptions from "@/lib/options/workspace.options";
import generateSlug from "@/lib/util/generateSlug";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";

const DEFAULT_COLUMNS = [
  { title: "Backlog", index: 0, emoji: "📚" },
  { title: "To Do", index: 1, emoji: "📝" },
  { title: "In Progress", index: 2, emoji: "🚧" },
  { title: "Awaiting Review", index: 3, emoji: "🔍" },
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

  // Conditionalize on currentWorkspace existing since we use `useQuery` and it is not suspenseful
  const isMember =
    currentWorkspace == null ||
    currentWorkspace?.members?.nodes?.[0]?.role === Role.Member;

  const maxProjectsReached = useMaxProjectsReached();

  const { data: projects } = useQuery({
    ...projectsOptions({ workspaceId: workspaceId! }),
    enabled: !!workspaceId,
    select: (data) => data?.projects?.nodes ?? [],
  });

  const newProjectColumnId =
    projectColumnId ??
    currentWorkspace?.projectColumns?.nodes[0]?.rowId ??
    null;

  const { data: projectColumnIndex } = useQuery({
    ...projectColumnsOptions({ workspaceId: workspaceId! }),
    enabled: !!workspaceId && !!currentWorkspace,
    select: (data) =>
      data?.projectColumns?.nodes?.find(
        (col) => col.rowId === newProjectColumnId,
      )?.projects?.totalCount,
  });

  const { isOpen: isCreateProjectOpen, setIsOpen: setIsCreateProjectOpen } =
    useDialogStore({
      type: DialogType.CreateProject,
    });

  useHotkeys(
    Hotkeys.CreateProject,
    () => setIsCreateProjectOpen(!isCreateProjectOpen),
    { enabled: !!workspaceSlug },
    [setIsCreateProjectOpen, isCreateProjectOpen, workspaceSlug],
  );

  const { mutateAsync: createColumn } = useCreateColumnMutation();
  const { mutateAsync: createUserPreference } =
    useCreateUserPreferenceMutation();

  const { mutateAsync: createNewProject } = useCreateProjectMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useProjectsQuery),
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

  const isProjectNameAvailable = async (name: string) => {
    if (!projects) return true;

    return !projects.some(
      (project) => project.name.toLowerCase() === name.toLowerCase(),
    );
  };

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      projectColumnId: newProjectColumnId,
      columnIndex: projectColumnIndex ?? 0,
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        if (value.name.trim().length < 3) {
          return {
            fields: {
              name: "Project name must be at least 3 characters long",
            },
          };
        }

        const isAvailable = await isProjectNameAvailable(value.name);

        if (!isAvailable) {
          return {
            fields: {
              name: "This project name is already taken",
            },
          };
        }

        return null;
      },
    },
    onSubmit: async ({ value, formApi }) => {
      toast.promise(
        createNewProject({
          input: {
            project: {
              workspaceId: workspaceId!,
              name: value.name,
              slug: generateSlug(value.name),
              description: value.description,
              projectColumnId: value.projectColumnId!,
              columnIndex: value.columnIndex,
            },
          },
        }),
        {
          loading: "Creating Project...",
          success: "Project created successfully!",
          error: "Something went wrong! Please try again.",
        },
      );

      setIsCreateProjectOpen(false);
      setProjectColumnId(null);
      formApi.reset();
    },
  });

  if (!workspaceSlug || isMember || maxProjectsReached) return null;

  return (
    <DialogRoot
      open={isCreateProjectOpen}
      onOpenChange={({ open }) => {
        setIsCreateProjectOpen(open);
        form.reset();

        if (!open) {
          setProjectColumnId(null);
        }
      }}
      initialFocusEl={() => nameRef.current}
      trapFocus
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
                <div className="flex flex-col gap-2">
                  <Input
                    ref={nameRef}
                    name="name"
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Project Name"
                    autoComplete="off"
                  />

                  {field.state.meta.errors.map((error, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: Allow index key for error messages
                    <p key={index} className="text-destructive text-xs">
                      {error}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <textarea
                  name="description"
                  autoComplete="off"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Project Description (optional)"
                  className="field-sizing-content flex min-h-16 w-full rounded-md border border-input px-3 py-2 text-xs shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:ring-destructive/40"
                />
              )}
            </form.Field>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                onClick={() => {
                  setIsCreateProjectOpen(false);
                  form.reset();
                }}
                variant="outline"
                tabIndex={0}
              >
                Cancel
              </Button>

              <form.Subscribe
                selector={(state) => [
                  state.canSubmit,
                  state.isSubmitting,
                  state.isDefaultValue,
                ]}
              >
                {([canSubmit, isSubmitting, isDefaultValue]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting || isDefaultValue}
                    tabIndex={0}
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
