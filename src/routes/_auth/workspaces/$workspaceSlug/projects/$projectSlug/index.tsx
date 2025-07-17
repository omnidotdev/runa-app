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
import * as z from "zod/v4";

import Board from "@/components/Board";
import Link from "@/components/core/Link";
import RichTextEditor from "@/components/core/RichTextEditor";
import Filter from "@/components/Filter";
import ListView from "@/components/ListView";
import NotFound from "@/components/layout/NotFound";
import CreateTaskDialog from "@/components/tasks/CreateTaskDialog";
import UpdateAssigneesDialog from "@/components/UpdateAssigneesDialog";
import UpdateDueDateDialog from "@/components/UpdateDueDateDialog";
import UpdateTaskLabelsDialog from "@/components/UpdateTaskLabelsDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarMenuShortcut } from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";
import { useUpdateProjectMutation } from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import useTaskStore from "@/lib/hooks/store/useTaskStore";
import projectOptions from "@/lib/options/project.options";
import tasksOptions from "@/lib/options/tasks.options";
import workspaceOptions from "@/lib/options/workspace.options";
import workspaceBySlugOptions from "@/lib/options/workspaceBySlug.options";
import workspaceUsersOptions from "@/lib/options/workspaceUsers.options";
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
  loaderDeps: ({ search: { search, assignees, labels, priorities } }) => ({
    search,
    assignees,
    labels,
    priorities,
  }),
  loader: async ({
    deps: { search, assignees, labels, priorities },
    params: { projectSlug, workspaceSlug },
    context: { queryClient },
  }) => {
    const { workspaceBySlug } = await queryClient.ensureQueryData(
      workspaceBySlugOptions({ slug: workspaceSlug, projectSlug }),
    );

    if (!workspaceBySlug || !workspaceBySlug.projects.nodes.length) {
      throw notFound();
    }

    const projectId = workspaceBySlug.projects.nodes[0].rowId;
    const projectName = workspaceBySlug.projects.nodes[0].name;

    await Promise.all([
      queryClient.ensureQueryData(projectOptions({ rowId: projectId })),
      queryClient.ensureQueryData(
        workspaceOptions({ rowId: workspaceBySlug.rowId }),
      ),
      queryClient.ensureQueryData(
        workspaceUsersOptions({ rowId: workspaceBySlug.rowId }),
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

    return { name: projectName, projectId, workspaceId: workspaceBySlug.rowId };
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
  const { projectSlug, workspaceSlug } = Route.useParams();
  const { projectId, workspaceId } = Route.useLoaderData();
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

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
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

  const { mutate: updateViewMode } = useUpdateProjectMutation({
    meta: {
      invalidates: [
        projectOptions({ rowId: projectId }).queryKey,
        workspaceOptions({ rowId: workspaceId }).queryKey,
      ],
    },
    onMutate: (variables) => {
      queryClient.setQueryData(
        projectOptions({ rowId: projectId }).queryKey,
        (old) => ({
          project: {
            ...old?.project!,
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
  });

  const handleProjectUpdate = useDebounceCallback(updateProject, 300);

  useHotkeys(
    Hotkeys.ToggleViewMode,
    () =>
      updateViewMode({
        rowId: projectId,
        patch: {
          viewMode: project?.viewMode === "board" ? "list" : "board",
        },
      }),
    [updateViewMode, project?.viewMode, projectId],
  );

  return (
    <div className="flex size-full">
      <div className="flex size-full flex-col">
        <div className="border-b px-6 py-4">
          <div className="flex flex-col gap-2">
            <RichTextEditor
              defaultContent={project?.name}
              className="min-h-0 border-0 bg-transparent p-0 text-2xl dark:bg-transparent"
              skeletonClassName="h-8 max-w-80"
              onUpdate={({ editor }) => {
                const text = editor.getText().trim();

                if (text.length < 3) {
                  setNameError("Project name must be at least 3 characters.");
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
                      {project?.viewMode === "list"
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
                      rowId: project?.rowId!,
                      patch: {
                        viewMode:
                          project?.viewMode === "board" ? "list" : "board",
                      },
                    })
                  }
                >
                  {project?.viewMode === "list" ? (
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

              {project?.viewMode === "list" && (
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

        {project?.viewMode === "board" ? (
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
