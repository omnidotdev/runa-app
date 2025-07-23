import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon, Trash2Icon } from "lucide-react";

import RichTextEditor from "@/components/core/RichTextEditor";
import EmojiSelector from "@/components/core/selectors/EmojiSelector";
import { Button } from "@/components/ui/button";
import { useUpdateColumnMutation } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";

import type { CSSProperties } from "react";
import type { ProjectColumnFragment as ProjectColumn } from "@/generated/graphql";

interface Props {
  projectColumn: ProjectColumn;
  setProjectColumnToDelete: (column: ProjectColumn) => void;
}

const DraggableProjectColumn = ({
  projectColumn,
  setProjectColumnToDelete,
}: Props) => {
  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    isDragging,
  } = useSortable({
    id: projectColumn.rowId,
  });

  const { setIsOpen: setIsDeleteProjectColumnDialogOpen } = useDialogStore({
    type: DialogType.DeleteProjectColumn,
  });

  const style: CSSProperties = {
    //let dnd-kit do its thing
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : undefined,
  };

  const { mutate: updateColumn } = useUpdateColumnMutation({
    meta: {
      invalidates: [["all"]],
    },
  });

  const handleColumnDelete = () => {
    setProjectColumnToDelete(projectColumn);
    setIsDeleteProjectColumnDialogOpen(true);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex w-full rounded-lg border bg-background"
    >
      <div
        {...attributes}
        {...listeners}
        aria-describedby={`DndDescribedBy-${projectColumn.rowId}`}
        className="flex w-10 cursor-move items-center justify-center"
      >
        <GripVerticalIcon className="flex size-3 text-muted-foreground" />
      </div>

      <div className="flex h-10 w-full flex-1 items-center justify-center">
        <EmojiSelector
          value={projectColumn.emoji || "😀"}
          onChange={(emoji) =>
            updateColumn({
              rowId: projectColumn.rowId,
              patch: {
                emoji,
              },
            })
          }
        />

        <div className="flex-1">
          <RichTextEditor
            defaultContent={projectColumn?.title}
            className="flex h-full min-h-10 items-center border-0 bg-transparent p-0 px-4 text-sm dark:bg-transparent"
            skeletonClassName="h-8 w-80"
            onUpdate={({ editor }) => {
              const text = editor.getText().trim();

              updateColumn({
                rowId: projectColumn.rowId,
                patch: {
                  title: text,
                },
              });
            }}
          />
        </div>
      </div>

      <div className="mr-2 ml-auto flex h-10 items-center justify-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-base-400 hover:text-red-500 dark:hover:text-red-400"
          onClick={handleColumnDelete}
        >
          <Trash2Icon className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default DraggableProjectColumn;
