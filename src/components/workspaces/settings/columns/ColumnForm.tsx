import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useLoaderData } from "@tanstack/react-router";
import {
  CheckIcon,
  GripVerticalIcon,
  MoreHorizontalIcon,
  PenLineIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";

import EmojiSelector from "@/components/core/selectors/EmojiSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { Tooltip } from "@/components/ui/tooltip";
import {
  useCreateProjectColumnMutation,
  useUpdateProjectColumnMutation,
} from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import useForm from "@/lib/hooks/useForm";
import { cn } from "@/lib/utils";

import type { CSSProperties, Dispatch, SetStateAction } from "react";
import type { ProjectColumnFragment as ProjectColumn } from "@/generated/graphql";

interface Props {
  column: ProjectColumn;
  isActive: boolean;
  hasActiveColumn: boolean;
  canDrag: boolean;
  onSetActive: (rowId: string | null) => void;
  setColumnToDelete?: (column: ProjectColumn) => void;
  setLocalColumns: Dispatch<SetStateAction<ProjectColumn[]>>;
}

const ColumnForm = ({
  column,
  isActive,
  onSetActive,
  hasActiveColumn,
  setColumnToDelete,
  setLocalColumns,
  canDrag,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { workspaceId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/settings",
  });

  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    isDragging,
  } = useSortable({
    id: column.rowId,
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

  const { mutate: createProjectColumn } = useCreateProjectColumnMutation({
      meta: {
        invalidates: [["all"]],
      },
      onError: (error) => console.error(error),
      onSuccess: (data) => {
        const newColumn = data?.createProjectColumn?.projectColumn;

        if (newColumn) {
          setLocalColumns((prev) => [...prev, newColumn]);
        }
      },
    }),
    { mutate: updateColumn } = useUpdateProjectColumnMutation({
      meta: {
        invalidates: [["all"]],
      },
      onError: (error) => console.error(error),
    });

  const form = useForm({
    defaultValues: {
      title: column.title,
      emoji: column.emoji || "😀",
      index: column.index,
    },
    onSubmit: ({ value, formApi }) => {
      if (column.rowId === "pending") {
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
      } else {
        setLocalColumns((prev) =>
          prev.map((c) =>
            c.rowId === column.rowId
              ? { ...c, title: value.title, emoji: value.emoji }
              : c,
          ),
        );

        updateColumn({
          rowId: column.rowId!,
          patch: {
            title: value.title,
            index: value.index,
            emoji: value.emoji,
          },
        });
      }

      onSetActive(null);
      formApi.reset();
    },
  });

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
      // Set the caret to the end of the input value
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length,
      );
    }
  }, [isActive]);

  return (
    <form
      ref={setNodeRef}
      style={style}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className={cn(
        "group flex h-10 w-full items-center px-2",
        isActive || column.rowId === "pending"
          ? "bg-accent"
          : "hover:bg-accent",
        hasActiveColumn && !isActive && "pointer-events-none",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        aria-describedby={`DndDescribedBy-${column.rowId}`}
        className={cn(
          "cursor-move items-center justify-center outline-none outline-hidden focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          canDrag ? "flex" : "invisible",
        )}
      >
        <GripVerticalIcon className="size-3 text-muted-foreground" />
      </div>

      <form.Field name="emoji">
        {(field) => (
          <EmojiSelector
            value={field.state.value}
            onChange={(emoji) => field.handleChange(emoji)}
            triggerProps={{
              variant: "outline",
              className:
                "size-10 flex justify-center items-center dark:bg-inherit border-0 shadow-none bg-inherit disabled:opacity-100 [&_.icon]:hidden rounded-none",
              disabled: !isActive,
            }}
          />
        )}
      </form.Field>

      <form.Field name="title">
        {(field) => (
          <Input
            ref={inputRef}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            disabled={!isActive}
            placeholder="Enter a column name..."
            className="border-0 shadow-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-default disabled:opacity-100"
          />
        )}
      </form.Field>

      {!isActive ? (
        <MenuRoot
          positioning={{
            strategy: "fixed",
            placement: "left",
          }}
        >
          <MenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-base-400 opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontalIcon />
            </Button>
          </MenuTrigger>

          <MenuPositioner>
            <MenuContent className="focus-within:outline-none">
              <MenuItem
                value="reset"
                onClick={() => onSetActive(column.rowId!)}
              >
                <PenLineIcon />
                <span> Edit</span>
              </MenuItem>

              <MenuItem
                value="reset"
                variant="destructive"
                onClick={() => {
                  setColumnToDelete?.(column);
                  setIsDeleteProjectColumnDialogOpen(true);
                }}
              >
                <Trash2Icon />
                <span> Delete </span>
              </MenuItem>
            </MenuContent>
          </MenuPositioner>
        </MenuRoot>
      ) : (
        <form.Subscribe
          selector={(state) => [
            state.canSubmit,
            state.isSubmitting,
            state.isDirty,
          ]}
        >
          {([canSubmit, isSubmitting, isDirty]) => (
            <div className="flex items-center justify-center">
              <Tooltip tooltip="Cancel">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => {
                    onSetActive(null);
                    form.reset();
                  }}
                  disabled={isSubmitting}
                >
                  <XIcon size={12} />
                </Button>
              </Tooltip>

              <Tooltip tooltip="Save">
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  disabled={!canSubmit || isSubmitting || !isDirty}
                >
                  <CheckIcon size={12} />
                </Button>
              </Tooltip>
            </div>
          )}
        </form.Subscribe>
      )}
    </form>
  );
};

export default ColumnForm;
