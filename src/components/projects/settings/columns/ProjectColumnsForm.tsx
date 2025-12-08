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
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { AlignJustifyIcon, MoreHorizontalIcon, PlusIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import DestructiveActionDialog from "@/components/core/DestructiveActionDialog";
import ColumnForm from "@/components/projects/settings/columns/ColumnForm";
import { Button } from "@/components/ui/button";
import {
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuItemIndicator,
  MenuItemText,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
  MenuTriggerItem,
} from "@/components/ui/menu";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Role,
  useDeleteColumnMutation,
  useUpdateColumnMutation,
  useUpdateUserPreferenceMutation,
} from "@/generated/graphql";
import { DialogType } from "@/lib/hooks/store/useDialogStore";
import columnsOptions from "@/lib/options/columns.options";
import projectOptions from "@/lib/options/project.options";
import userPreferencesOptions from "@/lib/options/userPreferences.options";
import workspaceOptions from "@/lib/options/workspace.options";
import { cn } from "@/lib/utils";

import type { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import type { ColumnFragment as Column } from "@/generated/graphql";

const ProjectColumnsForm = () => {
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  const { projectId, workspaceId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/settings",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/settings",
  });

  const { data: role } = useSuspenseQuery({
    ...workspaceOptions({ rowId: workspaceId, userId: session?.user?.rowId! }),
    select: (data) => data.workspace?.workspaceUsers?.nodes?.[0]?.role,
  });

  const isMember = role === Role.Member;

  const { data: columns } = useSuspenseQuery({
    ...columnsOptions({
      projectId,
    }),
    select: (data) => data?.columns?.nodes,
  });

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const { data: userPreferences } = useSuspenseQuery({
    ...userPreferencesOptions({
      userId: session?.user?.rowId!,
      projectId,
    }),
    select: (data) => data?.userPreferenceByUserIdAndProjectId,
  });

  const userHiddenColumns = userPreferences?.hiddenColumnIds ?? [];

  const [localColumns, setLocalColumns] = useState<Column[]>(columns ?? []);
  const [columnToDelete, setColumnToDelete] = useState<Column>();
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  const { mutate: updateColumn } = useUpdateColumnMutation({
      meta: {
        invalidates: [["all"]],
      },
    }),
    { mutate: deleteColumn } = useDeleteColumnMutation({
      meta: {
        invalidates: [["all"]],
      },
      onSuccess: (_data, variables) =>
        setLocalColumns((prev) =>
          prev.filter((column) => column.rowId !== variables.rowId),
        ),
    }),
    { mutate: updateUserPreferences } = useUpdateUserPreferenceMutation({
      meta: {
        invalidates: [["all"]],
      },
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
      updateColumn({
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
            Project Columns
          </h2>

          <MenuRoot
            positioning={{
              placement: "right-start",
              getAnchorRect: () =>
                menuButtonRef.current?.getBoundingClientRect() ?? null,
            }}
            closeOnSelect={false}
          >
            <Tooltip
              positioning={{ placement: "left" }}
              tooltip="Column options"
            >
              <MenuTrigger ref={menuButtonRef} asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Create new label"
                  className="mr-2 size-7"
                >
                  <MoreHorizontalIcon className="size-4" />
                </Button>
              </MenuTrigger>
            </Tooltip>

            <MenuPositioner>
              <MenuContent className="w-48 p-0">
                <MenuItemGroup>
                  <MenuItemGroupLabel>Column options</MenuItemGroupLabel>

                  <MenuSeparator />

                  <div className="mt-1 flex flex-col gap-0.5">
                    <MenuItem
                      value="new-column"
                      onSelect={handleCreateNewColumn}
                      disabled={activeColumnId !== null}
                      className={cn("hidden", !isMember && "flex")}
                    >
                      <PlusIcon />
                      Add New Column
                    </MenuItem>

                    <MenuRoot
                      positioning={{ placement: "right-start" }}
                      closeOnSelect={false}
                    >
                      <MenuTriggerItem>
                        <AlignJustifyIcon className="rotate-90" />
                        Columns
                      </MenuTriggerItem>

                      <MenuPositioner>
                        <MenuContent className="w-48">
                          {project?.columns.nodes.map((column) => {
                            const isHidden = userHiddenColumns.includes(
                              column.rowId,
                            );

                            return (
                              <MenuCheckboxItem
                                key={column.rowId}
                                closeOnSelect={false}
                                value={column.rowId}
                                checked={!isHidden} // ✅ checked when visible
                                onCheckedChange={(checked) => {
                                  if (checked === false) {
                                    // ✅ Checkbox was unchecked → hide column
                                    updateUserPreferences({
                                      rowId: userPreferences?.rowId!,
                                      patch: {
                                        hiddenColumnIds: [
                                          ...userHiddenColumns,
                                          column.rowId,
                                        ],
                                      },
                                    });
                                  } else {
                                    // ✅ Checkbox was checked → show column
                                    updateUserPreferences({
                                      rowId: userPreferences?.rowId!,
                                      patch: {
                                        hiddenColumnIds:
                                          userHiddenColumns.filter(
                                            (id) => id !== column.rowId,
                                          ),
                                      },
                                    });
                                  }
                                }}
                              >
                                <MenuItemText className="ml-0 flex items-center gap-2">
                                  <div className="flex items-center gap-2">
                                    <p>{column.emoji ?? "😀"}</p>
                                    <p className="font-light text-sm first-letter:uppercase">
                                      {column.title}
                                    </p>
                                  </div>
                                </MenuItemText>
                                <MenuItemIndicator />
                              </MenuCheckboxItem>
                            );
                          })}
                        </MenuContent>
                      </MenuPositioner>
                    </MenuRoot>
                  </div>
                </MenuItemGroup>
              </MenuContent>
            </MenuPositioner>
          </MenuRoot>
        </div>

        {isCreatingColumn && (
          <ColumnForm
            column={{
              rowId: "pending",
              title: "",
              emoji: "😀",
              index: localColumns.length,
              tasks: { totalCount: 0 },
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
            No project columns
          </div>
        ) : null}
      </div>

      <DestructiveActionDialog
        title="Danger Zone"
        description={
          <span>
            This will delete the column{" "}
            <strong className="font-medium text-base-900 dark:text-base-100">
              {columnToDelete?.title}
            </strong>{" "}
            including{" "}
            <strong className="font-medium text-base-900 dark:text-base-100">
              {columnToDelete?.tasks?.totalCount ?? 0} tasks
            </strong>
            . This action cannot be undone.
          </span>
        }
        onConfirm={() => {
          if (!columnToDelete) return;

          const currentColumns = localColumns.filter(
            (c) => c.rowId !== columnToDelete.rowId,
          );

          deleteColumn({
            rowId: columnToDelete.rowId,
          });

          for (const c of currentColumns) {
            updateColumn({
              rowId: c.rowId,
              patch: {
                index: currentColumns.findIndex((col) => col.rowId === c.rowId),
              },
            });
          }
        }}
        dialogType={DialogType.DeleteColumn}
        confirmation={`Delete ${columnToDelete?.title}`}
      />
    </>
  );
};

export default ProjectColumnsForm;
