import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";

import DestructiveActionDialog from "@/components/core/DestructiveActionDialog";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import ColumnForm from "@/components/workspaces/settings/columns/ColumnForm";
import {
  useDeleteProjectColumnMutation,
  useUpdateProjectColumnMutation,
} from "@/generated/graphql";
import { DialogType } from "@/lib/hooks/store/useDialogStore";
import projectColumnsOptions from "@/lib/options/projectColumns.options";

import type { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import type { ProjectColumnFragment as ProjectColumn } from "@/generated/graphql";

const ProjectColumnsForm = () => {
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  const { workspaceId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/settings",
  });

  const { data: projectColumns } = useSuspenseQuery({
    ...projectColumnsOptions({
      workspaceId,
    }),
    select: (data) => data?.projectColumns?.nodes,
  });

  const [localColumns, setLocalColumns] = useState<ProjectColumn[]>(
    projectColumns ?? [],
  );
  const [columnToDelete, setColumnToDelete] = useState<ProjectColumn>();

  const { mutate: updateProjectColumn } = useUpdateProjectColumnMutation({
      meta: {
        invalidates: [["all"]],
      },
    }),
    { mutate: deleteProjectColumn } = useDeleteProjectColumnMutation({
      meta: {
        invalidates: [["all"]],
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

  return (
    <>
      <div className="flex flex-col">
        <div className="mb-1 flex h-10 items-center justify-between">
          <h2 className="ml-2 flex items-center gap-2 font-medium text-base-700 text-sm lg:ml-0 dark:text-base-300">
            Workspace Columns
          </h2>

          <Tooltip
            tooltip="Create column"
            positioning={{
              placement: "left",
            }}
          >
            <Button
              variant="ghost"
              size="icon"
              aria-label="Create new column"
              className="mr-2 size-7"
              onClick={handleCreateNewColumn}
              disabled={activeColumnId !== null}
            >
              <PlusIcon />
            </Button>
          </Tooltip>
        </div>

        {isCreatingColumn && (
          <ColumnForm
            column={{
              rowId: "pending",
              title: "",
              emoji: "😀",
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
        title="Danger Zone"
        description={
          <span>
            This will delete the project column{" "}
            <strong className="font-medium text-base-900 dark:text-base-100">
              {columnToDelete?.title}
            </strong>{" "}
            including{" "}
            <strong className="font-medium text-base-900 dark:text-base-100">
              {columnToDelete?.projects?.totalCount ?? 0} tasks
            </strong>
            . This action cannot be undone.
          </span>
        }
        onConfirm={() => {
          if (!columnToDelete) return;

          const currentColumns = localColumns.filter(
            (c) => c.rowId !== columnToDelete?.rowId,
          );

          deleteProjectColumn({
            rowId: columnToDelete.rowId,
          });

          for (const c of currentColumns) {
            updateProjectColumn({
              rowId: c.rowId,
              patch: {
                index: currentColumns.findIndex((col) => col.rowId === c.rowId),
              },
            });
          }
        }}
        dialogType={DialogType.DeleteProjectColumn}
        confirmation={`Delete ${columnToDelete?.title}`}
      />
    </>
  );
};

export default ProjectColumnsForm;
