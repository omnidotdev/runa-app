import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import {
  EyeClosedIcon,
  EyeIcon,
  GripVerticalIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";

import RichTextEditor from "@/components/core/RichTextEditor";
import EmojiSelector from "@/components/core/selectors/EmojiSelector";
import { Button } from "@/components/ui/button";
import {
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip } from "@/components/ui/tooltip";
import {
  useCreateUserPreferenceMutation,
  useUpdateColumnMutation,
  useUpdateUserPreferenceMutation,
} from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import userPreferencesOptions from "@/lib/options/userPreferences.options";

import type { CSSProperties } from "react";
import type { ColumnFragment as Column } from "@/generated/graphql";

interface Props {
  column: Column;
  setColumnToDelete: (column: Column) => void;
}

const DraggableColumn = ({ column, setColumnToDelete }: Props) => {
  const { projectId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/settings",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/settings",
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

  const { setIsOpen: setIsDeleteColumnDialogOpen } = useDialogStore({
    type: DialogType.DeleteColumn,
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
    }),
    { mutate: updateUserPreferences } = useUpdateUserPreferenceMutation({
      meta: {
        invalidates: [["all"]],
      },
    }),
    { mutate: createUserPreference } = useCreateUserPreferenceMutation({
      meta: {
        invalidates: [["all"]],
      },
    });

  const { data: userPreferences } = useSuspenseQuery({
    ...userPreferencesOptions({
      // TODO: Dynamic userId
      userId: session?.user?.rowId!,
      projectId,
    }),
    select: (data) => data?.userPreferenceByUserIdAndProjectId,
  });

  const userHiddenColumns = userPreferences?.hiddenColumnIds as string[];

  const handleColumnHiding = () => {
    const isHidden = userHiddenColumns.includes(column.rowId);

    if (isHidden) {
      updateUserPreferences({
        rowId: userPreferences?.rowId!,
        patch: {
          hiddenColumnIds: userHiddenColumns.filter(
            (id) => id !== column.rowId,
          ),
        },
      });
    } else {
      if (!userPreferences) {
        createUserPreference({
          input: {
            userPreference: {
              // TODO: Dynamic userId
              userId: session?.user?.rowId!,
              projectId,
              hiddenColumnIds: [...userHiddenColumns, column.rowId],
            },
          },
        });
      } else {
        updateUserPreferences({
          rowId: userPreferences?.rowId!,
          patch: {
            hiddenColumnIds: [...userHiddenColumns, column.rowId],
          },
        });
      }
    }
  };

  const handleColumnDelete = () => {
    setColumnToDelete(column);
    setIsDeleteColumnDialogOpen(true);
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
        aria-describedby={`DndDescribedBy-${column.rowId}`}
        className="flex w-10 cursor-move items-center justify-center"
      >
        <GripVerticalIcon className="flex size-3 text-muted-foreground" />
      </div>

      <div className="flex h-10 w-full flex-1 items-center justify-center">
        <EmojiSelector
          value={column.emoji || "😀"}
          onChange={(emoji) =>
            updateColumn({
              rowId: column.rowId,
              patch: {
                emoji,
              },
            })
          }
        />

        <div className="flex-1">
          <RichTextEditor
            defaultContent={column?.title}
            className="flex h-full min-h-10 items-center border-0 bg-transparent p-0 px-4 text-sm dark:bg-transparent"
            skeletonClassName="h-8 w-80"
            onUpdate={({ editor }) => {
              const text = editor.getText().trim();

              updateColumn({
                rowId: column.rowId,
                patch: {
                  title: text,
                },
              });
            }}
          />
        </div>
      </div>

      <div className="mr-2 ml-auto flex h-10 items-center justify-center gap-1">
        <div className="hidden items-center gap-1 lg:flex">
          <Tooltip
            tooltip={
              userHiddenColumns?.includes(column.rowId) ? "Show" : "Hide column"
            }
          >
            <Button
              variant="ghost"
              size="xs"
              className="h-7 w-7 p-1 text-base-400"
              onClick={handleColumnHiding}
            >
              {userHiddenColumns?.includes(column.rowId) ? (
                <EyeClosedIcon className="size-4" />
              ) : (
                <EyeIcon className="size-4" />
              )}
            </Button>
          </Tooltip>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-base-400 hover:text-red-500 dark:hover:text-red-400"
            onClick={handleColumnDelete}
          >
            <Trash2Icon className="size-4" />
          </Button>
        </div>

        {/* Mobile Popover */}
        <div className="flex lg:hidden">
          <PopoverRoot
            positioning={{
              strategy: "fixed",
              placement: "left",
            }}
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-base-400 text-md hover:text-base-600 dark:hover:text-base-300"
              >
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverPositioner>
              <PopoverContent className="flex h-full w-40 flex-col gap-1 p-1 text-sm">
                <Button
                  size="xs"
                  variant="ghost"
                  className="flex justify-start gap-2"
                  onClick={handleColumnHiding}
                >
                  {userHiddenColumns?.includes(column.rowId) ? (
                    <div className="flex items-center gap-2">
                      <EyeClosedIcon className="size-4" /> Unhide column
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <EyeIcon className="size-4" /> Hide column
                    </div>
                  )}
                </Button>

                <Button
                  size="xs"
                  onClick={handleColumnDelete}
                  className="flex w-full items-center justify-start gap-2 rounded-sm bg-background px-2 py-1.5 text-destructive shadow-none hover:bg-destructive/10 dark:hover:bg-destructive/20"
                >
                  <Trash2Icon className="size-4" /> Delete
                </Button>
              </PopoverContent>
            </PopoverPositioner>
          </PopoverRoot>
        </div>
      </div>
    </div>
  );
};

export default DraggableColumn;
