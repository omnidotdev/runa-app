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
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import ConfirmDialog from "@/components/ConfirmDialog";
import EmojiSelector from "@/components/core/selectors/EmojiSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCreateProjectColumnMutation,
  useDeleteProjectColumnMutation,
  useUpdateProjectColumnMutation,
} from "@/generated/graphql";
import { DialogType } from "@/lib/hooks/store/useDialogStore";
import useForm from "@/lib/hooks/useForm";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import DraggableProjectColumn from "./DraggableProjectColumn";

import type { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import type { ProjectColumnFragment as ProjectColumn } from "@/generated/graphql";

const WorkspaceColumnsForm = () => {
  const { workspaceId } = useParams({
    from: "/_auth/workspaces/$workspaceId/settings",
  });

  const { data: projectColumnsData } = useQuery({
    ...projectColumnsOptions({
      workspaceId,
    }),
    select: (data) => data?.projectColumns?.nodes,
  });

  const [localProjectColumns, setLocalProjectColumns] = useState<
    ProjectColumn[]
  >(projectColumnsData ?? []);
  const [projectColumnToDelete, setProjectColumnToDelete] =
    useState<ProjectColumn>();

  const { mutate: createProjectColumn } = useCreateProjectColumnMutation({
      meta: {
        invalidates: [["all"]],
      },
    }),
    { mutate: updateProjectColumn } = useUpdateProjectColumnMutation({
      meta: {
        invalidates: [["all"]],
      },
    }),
    { mutate: deleteProjectColumn } = useDeleteProjectColumnMutation({
      meta: {
        invalidates: [["all"]],
      },
    });

  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      emoji: "😀",
      index: projectColumnsData?.length
        ? projectColumnsData.length + 1
        : undefined,
    },
    onSubmit: ({ value, formApi }) => {
      createProjectColumn({
        input: {
          projectColumn: {
            workspaceId,
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
    () => localProjectColumns.map(({ rowId }) => rowId),
    [localProjectColumns],
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = dataIds.indexOf(active.id);
    const newIndex = dataIds.indexOf(over.id);
    const reordered = arrayMove(localProjectColumns, oldIndex, newIndex);

    // Optimistically update the local state
    setLocalProjectColumns(reordered);

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

  useEffect(() => {
    if (projectColumnsData) {
      setLocalProjectColumns(projectColumnsData);
    }
  }, [projectColumnsData]);

  return (
    <>
      <div className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 font-medium text-base-700 text-sm dark:text-base-300">
          Project Columns
        </h2>

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
                  className: "h-9",
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
              {localProjectColumns?.map((projectColumn) => (
                <DraggableProjectColumn
                  key={projectColumn.rowId}
                  projectColumn={projectColumn}
                  setProjectColumnToDelete={setProjectColumnToDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <ConfirmDialog
        title="Danger Zone"
        description={
          <span>
            This will delete the project column{" "}
            <strong className="font-medium text-base-900 dark:text-base-100">
              {projectColumnToDelete?.title}
            </strong>{" "}
            including{" "}
            <strong className="font-medium text-base-900 dark:text-base-100">
              {projectColumnToDelete?.projects?.totalCount ?? 0} tasks
            </strong>
            . This action cannot be undone.
          </span>
        }
        onConfirm={() => {
          if (!projectColumnToDelete) return;

          deleteProjectColumn({
            rowId: projectColumnToDelete.rowId,
          });

          for (const c of localProjectColumns) {
            updateProjectColumn({
              rowId: c.rowId,
              patch: {
                index:
                  c.index > projectColumnToDelete.index ? c.index - 1 : c.index,
              },
            });
          }
        }}
        dialogType={DialogType.DeleteProjectColumn}
        confirmation={`Delete ${projectColumnToDelete?.title}`}
        inputProps={{
          className: "focus-visible:ring-red-500",
        }}
      />
    </>
  );
};

export default WorkspaceColumnsForm;
