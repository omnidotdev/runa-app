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
// needed for row & cell level scope DnD setup
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCreateColumnMutation,
  useDeleteColumnMutation,
  useUpdateColumnMutation,
} from "@/generated/graphql";
import { DialogType } from "@/lib/hooks/store/useDialogStore";
import useForm from "@/lib/hooks/useForm";
import columnsOptions from "@/lib/options/columns.options";
import ConfirmDialog from "../ConfirmDialog";
import EmojiSelector from "../core/selectors/EmojiSelector";
import DraggableColumn from "./DraggableColumn";

import type { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import type { ColumnFragment as Column } from "@/generated/graphql";

const ProjectColumnsForm = () => {
  const { projectId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/settings",
  });

  const [showHiddenColumns, setShowHiddenColumns] = useState(false);

  const { data: columnsData } = useQuery({
    ...columnsOptions({
      projectId,
    }),
    select: (data) => data?.columns?.nodes,
  });

  const [localColumns, setLocalColumns] = useState<Column[]>(columnsData ?? []);
  const [columnToDelete, setColumnToDelete] = useState<Column>();

  const { mutate: createColumn } = useCreateColumnMutation({
      meta: {
        invalidates: [["all"]],
      },
    }),
    { mutate: updateColumn } = useUpdateColumnMutation({
      meta: {
        invalidates: [["all"]],
      },
    }),
    { mutate: deleteColumn } = useDeleteColumnMutation({
      meta: {
        invalidates: [["all"]],
      },
    });

  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      emoji: "😀",
      index: columnsData?.length ? columnsData.length + 1 : undefined,
    },
    onSubmit: ({ value, formApi }) => {
      createColumn({
        input: {
          column: {
            projectId,
            title: value.title,
            index: value.index,
            emoji: value.emoji,
          },
        },
      });

      formApi.reset();
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

  useEffect(() => {
    if (columnsData) {
      setLocalColumns(columnsData);
    }
  }, [columnsData]);

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* <div className="flex items-center justify-between gap-2"> */}
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 font-medium text-base-700 text-sm dark:text-base-300">
            Project Columns
          </h2>

          {/* {localColumns.filter(({ hidden }) => hidden).length > 0 && (
            <SwitchRoot
              onCheckedChange={() => setShowHiddenColumns(!showHiddenColumns)}
            >
              <SwitchHiddenInput />
              <SwitchLabel className="font-normal text-xs">
                {showHiddenColumns ? "Hide hidden" : "Show hidden"}
              </SwitchLabel>
              <SwitchControl size="xs">
                <SwitchThumb size="xs" />
              </SwitchControl>
            </SwitchRoot>
          )} */}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
          }}
          className="flex items-center gap-2"
        >
          <Field name="emoji">
            {(field) => (
              <EmojiSelector
                value={field.state.value}
                onChange={(emoji) => field.handleChange(emoji)}
                triggerProps={{
                  variant: "outline",
                }}
              />
            )}
          </Field>

          <Field name="title">
            {(field) => (
              <Input
                id="name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter a column name..."
                className="border text-xs shadow-none placeholder:opacity-50 focus-visible:ring-0 disabled:opacity-100"
              />
            )}
          </Field>

          <div className="flex items-center justify-center">
            <Subscribe
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
                state.isDirty,
              ]}
            >
              {([canSubmit, isSubmitting, isDirty]) => (
                <Button
                  size="icon"
                  type="submit"
                  disabled={!canSubmit || isSubmitting || !isDirty}
                >
                  <PlusIcon className="size-4" />
                </Button>
              )}
            </Subscribe>
          </div>
        </form>

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
            <div className="flex flex-col gap-2">
              {localColumns?.map((column) => (
                <DraggableColumn
                  key={column.rowId}
                  column={column}
                  columns={localColumns}
                  setColumnToDelete={setColumnToDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <ConfirmDialog
        title="Danger Zone"
        description={`This will delete the column "${columnToDelete?.title}". This action cannot be undone.`}
        onConfirm={() => {
          if (!columnToDelete) return;

          deleteColumn({
            rowId: columnToDelete.rowId,
          });

          for (const c of localColumns) {
            updateColumn({
              rowId: c.rowId,
              patch: {
                index: c.index > columnToDelete.index ? c.index - 1 : c.index,
              },
            });
          }
        }}
        dialogType={DialogType.DeleteColumn}
        confirmation={`permanently delete ${columnToDelete?.title}`}
        inputProps={{
          className: "focus-visible:ring-red-500",
        }}
      />
    </>
  );
};

export default ProjectColumnsForm;
