import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound, stripSearchParams } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import {
  Grid2X2Icon,
  ListIcon,
  Maximize2Icon,
  Minimize2Icon,
  SearchIcon,
  Settings2,
} from "lucide-react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod";

import Link from "@/components/core/Link";
import RichTextEditor from "@/components/core/RichTextEditor";
import Filter from "@/components/Filter";
import NotFound from "@/components/layout/NotFound";
import Board from "@/components/projects/Board";
import ListView from "@/components/projects/ListView";
import CreateTaskDialog from "@/components/tasks/CreateTaskDialog";
import UpdateAssigneesDialog from "@/components/UpdateAssigneesDialog";
import UpdateDueDateDialog from "@/components/UpdateDueDateDialog";
import UpdateTaskLabelsDialog from "@/components/UpdateTaskLabelsDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarMenuShortcut } from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import {
  useUpdateProjectMutation,
  useUpdateUserPreferenceMutation,
} from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import getSdk from "@/lib/graphql/getSdk";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import projectOptions from "@/lib/options/project.options";
import tasksOptions from "@/lib/options/tasks.options";
import userPreferencesOptions from "@/lib/options/userPreferences.options";
import generateSlug from "@/lib/util/generateSlug";
import seo from "@/lib/util/seo";

import type { ChangeEvent } from "react";

const projectSearchParamsSchema = z.object({
  search: z.string().default(""),
  // See: https://zod.dev/v4/changelog?id=stricter-uuid
  assignees: z.array(z.guid()).default([]),
  labels: z.array(z.guid()).default([]),
  priorities: z.array(z.enum(["low", "medium", "high"])).default([]),
  createTask: z.boolean().default(false),
});

export const Route = createFileRoute({
  // TODO: scaffold out. `loader` work takes longer than the preload of `intent` so without the `pendingComponent` we get flash of content
  pendingComponent: () => (
    <div className="flex size-full items-center justify-center">Loading...</div>
  ),
  loaderDeps: ({ search: { search, assignees, labels, priorities } }) => ({
    search,
    assignees,
    labels,
    priorities,
  }),
  loader: async ({
    deps: { search, assignees, labels, priorities },
    context: { queryClient, workspaceBySlug, userPreferences },
  }) => {
    if (
      !workspaceBySlug ||
      !workspaceBySlug.projects.nodes.length ||
      !userPreferences
    ) {
      throw notFound();
    }

    const project = workspaceBySlug.projects.nodes[0];

    const projectId = project.rowId;
    const projectName = project.name;

    await Promise.all([
      queryClient.ensureQueryData(
        projectOptions({
          rowId: projectId,
          hiddenColumns: userPreferences.hiddenColumnIds as string[],
        }),
      ),
      queryClient.ensureQueryData(
        tasksOptions({
          projectId,
          search,
          assignees: assignees.length
            ? { some: { user: { rowId: { in: assignees } } } }
            : undefined,
          labels: labels.length
            ? { some: { label: { rowId: { in: labels } } } }
            : undefined,
          priorities: priorities.length ? priorities : undefined,
        }),
      ),
    ]);

    return {
      name: projectName,
      projectId,
      workspaceId: workspaceBySlug.rowId,
    };
  },
  validateSearch: zodValidator(projectSearchParamsSchema),
  search: {
    middlewares: [
      stripSearchParams({
        search: "",
        assignees: [],
        labels: [],
        priorities: [],
        createTask: false,
      }),
    ],
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [...seo({ title: loaderData.name })] : undefined,
  }),
  notFoundComponent: () => <NotFound>Project Not Found</NotFound>,
  component: ProjectPage,
});

function ProjectPage() {
  const { session } = Route.useRouteContext();
  const { projectSlug, workspaceSlug } = Route.useParams();
  const { projectId } = Route.useLoaderData();
  const { search } = Route.useSearch();
  const [isForceClosed, setIsForceClosed] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const navigate = Route.useNavigate();

  const { queryClient } = Route.useRouteContext();

  const { taskId, columnId } = useTaskStore();

  const handleSearch = useDebounceCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      navigate({
        search: (prev) => ({
          ...prev,
          search: e.target.value.length ? e.target.value : "",
        }),
      });
    },
    300,
  );

  const { data: userPreferences } = useSuspenseQuery({
    ...userPreferencesOptions({
      userId: session?.user.rowId!,
      projectId,
    }),
    select: (data) => data?.userPreferenceByUserIdAndProjectId,
  });

  const { data: project } = useSuspenseQuery({
    ...projectOptions({
      rowId: projectId,
      hiddenColumns: userPreferences?.hiddenColumnIds as string[],
    }),
    select: (data) => data?.project,
  });

  const editNameSchema = z
    .object({
      name: z
        .string()
        .min(3, { error: "Name must be at least 3 characters." })
        .default(project?.name!),
      currentSlug: z.string().default(project?.slug!),
    })
    .check(async (ctx) => {
      const sdk = await getSdk();

      const updatedSlug = generateSlug(ctx.value.name);

      if (!updatedSlug?.length || updatedSlug === ctx.value.currentSlug)
        return z.NEVER;

      const { workspaceBySlug } = await sdk.WorkspaceBySlug({
        slug: workspaceSlug,
        projectSlug: updatedSlug,
      });

      if (workspaceBySlug?.projects.nodes.length) {
        ctx.issues.push({
          code: "custom",
          message: "Project slug already exists for this workspace.",
          input: ctx.value.name,
        });
      }
    });

  const [projectColumnOpenStates, setProjectColumnOpenStates] = useState(
    project?.columns?.nodes?.map(() => true) ?? [],
  );

  const handleCloseAll = () => {
    setProjectColumnOpenStates((prev) => prev.map(() => false));
    setIsForceClosed(true);
  };

  const handleOpenAll = () => {
    setProjectColumnOpenStates((prev) => prev.map(() => true));
    setIsForceClosed(false);
  };

  const { mutate: updateViewMode } = useUpdateUserPreferenceMutation({
    meta: {
      invalidates: [["all"]],
    },
    onMutate: (variables) => {
      queryClient.setQueryData(
        userPreferencesOptions({
          projectId: projectId,
          userId: session?.user?.rowId!,
        }).queryKey,
        (old) => ({
          userPreferenceByUserIdAndProjectId: {
            ...old?.userPreferenceByUserIdAndProjectId!,
            viewMode: variables.patch?.viewMode!,
          },
        }),
      );
    },
  });

  const { mutate: updateProject } = useUpdateProjectMutation({
    meta: {
      invalidates: [["all"]],
    },
    onSuccess: (_data, variables) => {
      if (variables.patch.slug) {
        navigate({
          to: "/workspaces/$workspaceSlug/projects/$projectSlug",
          params: { workspaceSlug, projectSlug: variables.patch.slug },
          replace: true,
        });
      }
    },
  });

  const handleProjectUpdate = useDebounceCallback(updateProject, 300);

  useHotkeys(
    Hotkeys.ToggleViewMode,
    () =>
      updateViewMode({
        rowId: userPreferences?.rowId!,
        patch: {
          viewMode: userPreferences?.viewMode === "board" ? "list" : "board",
        },
      }),
    [updateViewMode, userPreferences?.viewMode, projectId],
  );

  return (
    <div className="flex size-full">
      <div className="flex size-full flex-col">
        <div className="border-b px-6 py-4">
          <div className="flex flex-col gap-2">
            <RichTextEditor
              key={project?.name}
              defaultContent={project?.name}
              className="min-h-0 border-0 bg-transparent p-0 text-2xl dark:bg-transparent"
              skeletonClassName="h-8 max-w-80"
              onUpdate={async ({ editor }) => {
                const text = editor.getText().trim();

                const result = await editNameSchema.safeParseAsync({
                  name: text,
                });

                if (!result.success) {
                  setNameError(result.error.issues[0].message);
                  return;
                }

                setNameError(null);
                handleProjectUpdate({
                  rowId: projectId,
                  patch: { name: text, slug: generateSlug(text) },
                });
              }}
            />

            {nameError && (
              <p className="mt-1 text-red-500 text-sm">{nameError}</p>
            )}

            <RichTextEditor
              key={project?.description}
              defaultContent={project?.description || ""}
              className="min-h-0 border-0 bg-transparent p-0 text-base-600 text-sm dark:bg-transparent dark:text-base-400"
              placeholder="Add a short description..."
              skeletonClassName="h-5 max-w-40"
              onUpdate={({ editor }) =>
                handleProjectUpdate({
                  rowId: projectId,
                  patch: {
                    description: editor.getText(),
                  },
                })
              }
            />

            <div className="mt-2 flex flex-wrap gap-2 sm:flex-nowrap">
              <div className="relative flex-1 sm:flex-none">
                <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-base-400" />
                <Input
                  defaultValue={search}
                  onChange={handleSearch}
                  placeholder="Search tasks..."
                  className="pl-10"
                />
              </div>
              <Tooltip
                positioning={{ placement: "bottom" }}
                tooltip={{
                  className: "bg-background text-foreground border",
                  children: (
                    <div className="inline-flex">
                      {userPreferences?.viewMode === "list"
                        ? "Board View"
                        : "List View"}
                      <div className="ml-2 flex items-center gap-0.5">
                        <SidebarMenuShortcut>V</SidebarMenuShortcut>
                      </div>
                    </div>
                  ),
                }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    updateViewMode({
                      rowId: userPreferences?.rowId!,
                      patch: {
                        viewMode:
                          userPreferences?.viewMode === "board"
                            ? "list"
                            : "board",
                      },
                    })
                  }
                >
                  {userPreferences?.viewMode === "list" ? (
                    <Grid2X2Icon />
                  ) : (
                    <ListIcon />
                  )}
                </Button>
              </Tooltip>

              <Tooltip
                positioning={{ placement: "bottom" }}
                tooltip={{
                  className: "bg-background text-foreground border",
                  children: "Project Settings",
                }}
              >
                <Link
                  to="/workspaces/$workspaceSlug/projects/$projectSlug/settings"
                  params={{
                    workspaceSlug,
                    projectSlug,
                  }}
                  variant="outline"
                  size="icon"
                >
                  <Settings2 />
                </Link>
              </Tooltip>

              <Filter />

              {userPreferences?.viewMode === "list" && (
                <Tooltip
                  positioning={{ placement: "bottom" }}
                  tooltip={{
                    className: "bg-background text-foreground border",
                    children: isForceClosed ? "Expand Lists" : "Collapse Lists",
                  }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={isForceClosed ? handleOpenAll : handleCloseAll}
                  >
                    {isForceClosed ? <Maximize2Icon /> : <Minimize2Icon />}
                  </Button>
                </Tooltip>
              )}
            </div>
          </div>
        </div>

        {userPreferences?.viewMode === "board" ? (
          <Board />
        ) : (
          <ListView
            openStates={projectColumnOpenStates}
            setOpenStates={setProjectColumnOpenStates}
            setIsForceClosed={setIsForceClosed}
          />
        )}
      </div>

      <CreateTaskDialog columnId={columnId ?? undefined} />
      {taskId && <UpdateAssigneesDialog />}
      {taskId && <UpdateDueDateDialog />}
      {taskId && <UpdateTaskLabelsDialog />}
    </div>
  );
}
