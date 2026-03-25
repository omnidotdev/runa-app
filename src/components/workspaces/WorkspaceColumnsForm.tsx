import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DestructiveActionDialog, Tooltip } from "@/components/core";
import { Button } from "@/components/ui/button";
import {
  useDeleteProjectColumnMutation,
  useProjectColumnsQuery,
  useProjectsSidebarQuery,
  useUpdateProjectColumnMutation,
} from "@/generated/graphql";
import { DialogType } from "@/lib/hooks/store/useDialogStore";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import { Role } from "@/lib/permissions";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { cn } from "@/lib/utils";
import ColumnForm from "./WorkspaceColumnForm";

import type { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import type { ProjectColumnFragment as ProjectColumn } from "@/generated/graphql";

const ProjectColumnsForm = () => {
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  const { organizationId } = useLoaderData({
    from: "/_app/workspaces/$workspaceSlug/settings",
  });

  // Get role from IDP organization claims
  const role = useCurrentUserRole(organizationId);
  const isMember = role === Role.Member;

  const { data: projectColumns } = useSuspenseQuery({
    ...projectColumnsOptions({
      organizationId: organizationId!,
    }),
    select: (data) => data?.projectColumns?.nodes,
  });

  const [localColumns, setLocalColumns] = useState<ProjectColumn[]>(
    projectColumns ?? [],
  );
  const [columnToDelete, setColumnToDelete] = useState<ProjectColumn>();

  const { mutate: updateProjectColumn } = useUpdateProjectColumnMutation({
      meta: {
        invalidates: [getQueryKeyPrefix(useProjectColumnsQuery)],
      },
    }),
    { mutateAsync: deleteProjectColumn } = useDeleteProjectColumnMutation({
      meta: {
        invalidates: [
          getQueryKeyPrefix(useProjectColumnsQuery),
          getQueryKeyPrefix(useProjectsSidebarQuery),
        ],
      },
      onSuccess: (_data, variables) =>
        setLocalColumns((prev) =>
          prev.filter((column) => column.rowId !== variables.rowId),
        ),
    });

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => localColumns.map(({ rowId }) => rowId),
    [localColumns],
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = dataIds.indexOf(active.id);
    const newIndex = dataIds.indexOf(over.id);
    const reordered = arrayMove(localColumns, oldIndex, newIndex);

    // Optimistically update the local state
    setLocalColumns(reordered);

    reordered.forEach((column, index) => {
      updateProjectColumn({
        rowId: column.rowId,
        patch: { index: index },
      });
    });
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const handleSetActiveColumn = (rowId: string | null) => {
    setActiveColumnId(rowId);
    if (rowId === null) {
      setIsCreatingColumn(false);
    }
  };

  const handleCreateNewColumn = () => {
    setIsCreatingColumn(true);
    setActiveColumnId("pending");
  };

  const hasColumns = !!localColumns?.length;
  const showEmptyState = !hasColumns && !isCreatingColumn;
  const hasActiveColumn = localColumns?.some(
    (label) => label.rowId === activeColumnId,
  );

  const handleDeleteColumn = () => {
    if (!columnToDelete) return;

    const currentColumns = localColumns.filter(
      (c) => c.rowId !== columnToDelete.rowId,
    );

    const projectCount = columnToDelete.projects?.totalCount ?? 0;
    const promise = deleteProjectColumn({ rowId: columnToDelete.rowId });

    for (const c of currentColumns) {
      updateProjectColumn({
        rowId: c.rowId,
        patch: {
          index: currentColumns.findIndex((col) => col.rowId === c.rowId),
        },
      });
    }

    toast.promise(promise, {
      loading: "Deleting column and projects...",
      success:
        projectCount > 0
          ? `Workspace column "${columnToDelete.title}" and ${projectCount} ${projectCount === 1 ? "project" : "projects"} deleted`
          : `Workspace column "${columnToDelete.title}" deleted`,
      error: "Failed to delete column",
    });
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="mb-1 flex h-10 items-center justify-between">
          <h2 className="ml-2 flex items-center gap-2 font-medium text-base-700 text-sm lg:ml-0 dark:text-base-300">
            Workspace Columns
          </h2>

          <Tooltip
            positioning={{ placement: "left" }}
            tooltip="Create column"
            trigger={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Create new column"
                className={cn("mr-2 hidden size-7", !isMember && "inline-flex")}
                onClick={handleCreateNewColumn}
                disabled={activeColumnId !== null}
              >
                <PlusIcon />
              </Button>
            }
          />
        </div>

        {isCreatingColumn && (
          <ColumnForm
            column={{
              rowId: "pending",
              title: "",
              icon: "emoji:😀",
              index: localColumns.length,
              projects: { totalCount: 0 },
            }}
            isActive={true}
            onSetActive={handleSetActiveColumn}
            hasActiveColumn={hasActiveColumn || activeColumnId === "pending"}
            setLocalColumns={setLocalColumns}
            canDrag={false}
          />
        )}

        {hasColumns ? (
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <SortableContext
              items={dataIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col divide-y border-y">
                {localColumns?.map((column) => (
                  <ColumnForm
                    key={column.rowId}
                    column={column}
                    isActive={activeColumnId === column.rowId}
                    onSetActive={handleSetActiveColumn}
                    hasActiveColumn={
                      hasActiveColumn || activeColumnId === "pending"
                    }
                    setColumnToDelete={setColumnToDelete}
                    setLocalColumns={setLocalColumns}
                    canDrag={localColumns.length > 1}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : showEmptyState ? (
          <div className="ml-2 flex items-center text-base-500 text-sm lg:ml-0">
            No workspace columns
          </div>
        ) : null}
      </div>

      <DestructiveActionDialog
        title="Delete workspace column"
        description={
          <span>
            This will permanently delete the{" "}
            <strong className="font-medium text-base-900 dark:text-base-100">
              {columnToDelete?.title}
            </strong>{" "}
            column and all{" "}
            <strong className="font-medium text-base-900 dark:text-base-100">
              {columnToDelete?.projects?.totalCount}{" "}
              {columnToDelete?.projects?.totalCount === 1
                ? "project"
                : "projects"}
            </strong>{" "}
            within it, including their columns, tasks, labels, and member
            assignments. This action cannot be undone.
          </span>
        }
        onConfirm={handleDeleteColumn}
        dialogType={DialogType.DeleteProjectColumn}
        confirmation={columnToDelete?.title}
      />
    </>
  );
};

export default ProjectColumnsForm;
