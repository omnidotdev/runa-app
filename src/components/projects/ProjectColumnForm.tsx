import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import {
  CheckIcon,
  EyeClosedIcon,
  EyeIcon,
  GripVerticalIcon,
  MoreHorizontalIcon,
  PenLineIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { EmojiSelector, Tooltip } from "@/components/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  useColumnsQuery,
  useCreateColumnMutation,
  useCreateUserPreferenceMutation,
  useProjectQuery,
  useUpdateColumnMutation,
  useUpdateUserPreferenceMutation,
  useUserPreferencesQuery,
} from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import useForm from "@/lib/hooks/useForm";
import userPreferencesOptions from "@/lib/options/userPreferences.options";
import { Role } from "@/lib/permissions";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { cn } from "@/lib/utils";

import type { CSSProperties, Dispatch, SetStateAction } from "react";
import type { ColumnFragment as Column } from "@/generated/graphql";

interface Props {
  column: Column;
  isActive: boolean;
  hasActiveColumn?: boolean;
  canDrag: boolean;
  onSetActive: (rowId: string | null) => void;
  setColumnToDelete?: (column: Column) => void;
  setLocalColumns: Dispatch<SetStateAction<Column[]>>;
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

  const { projectId, organizationId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/settings",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/settings",
  });

  // Get role from IDP organization claims
  const role = useCurrentUserRole(organizationId);
  const isMember = role === Role.Member;

  const [isHovering, setIsHovering] = useState(false);

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
        invalidates: [
          getQueryKeyPrefix(useColumnsQuery),
          getQueryKeyPrefix(useProjectQuery),
        ],
      },
    }),
    { mutate: updateUserPreferences } = useUpdateUserPreferenceMutation({
      meta: {
        invalidates: [getQueryKeyPrefix(useUserPreferencesQuery)],
      },
    }),
    { mutate: createUserPreference } = useCreateUserPreferenceMutation({
      meta: {
        invalidates: [getQueryKeyPrefix(useUserPreferencesQuery)],
      },
    });

  const { data: userPreferences } = useSuspenseQuery({
    ...userPreferencesOptions({
      userId: session?.user?.rowId!,
      projectId,
    }),
    select: (data) => data?.userPreferenceByUserIdAndProjectId,
  });

  const userHiddenColumns = userPreferences?.hiddenColumnIds as string[];

  const { mutate: createColumn } = useCreateColumnMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useColumnsQuery),
        getQueryKeyPrefix(useProjectQuery),
      ],
    },
    onError: (error) => console.error(error),
    onSuccess: (data) => {
      const newColumn = data?.createColumn?.column;

      if (newColumn) {
        setLocalColumns((prev) => [...prev, newColumn]);
      }
    },
  });

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

      toast.info(`Column "${column.title}" hidden`, {
        description: "You can unhide it from project settings.",
      });
    }
  };

  const form = useForm({
    defaultValues: {
      title: column.title,
      emoji: column.emoji as string | null,
      index: column.index,
    },
    onSubmit: ({ value, formApi }) => {
      if (column.rowId === "pending") {
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
            emoji: value.emoji,
            index: value.index,
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
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
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
        isDragging && "border-y",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        aria-describedby={`DndDescribedBy-${column.rowId}`}
        className={cn(
          "mr-1 h-9 cursor-move items-center justify-center rounded-sm outline-hidden transition-[color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          canDrag ? "flex" : "invisible",
          isMember && "hidden",
        )}
      >
        <GripVerticalIcon className="flex size-3 text-muted-foreground" />
      </div>

      <form.Field name="emoji">
        {(field) => (
          <EmojiSelector
            value={field.state.value}
            onChange={(emoji) => field.handleChange(emoji)}
            triggerProps={{
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
            className="rounded border-0 shadow-none focus-visible:ring-offset-0 disabled:cursor-default disabled:opacity-100"
            id="column-name-input"
            autoComplete="off"
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
              tabIndex={isHovering ? 0 : -1}
            >
              <MoreHorizontalIcon />
            </Button>
          </MenuTrigger>

          <MenuPositioner>
            <MenuContent className="focus-within:outline-none">
              <MenuItem
                value="edit"
                onClick={() => onSetActive(column.rowId!)}
                className={cn("hidden", !isMember && "flex")}
              >
                <PenLineIcon />
                <span> Edit</span>
              </MenuItem>

              <MenuItem value="hide" onClick={handleColumnHiding}>
                {userHiddenColumns?.includes(column.rowId) ? (
                  <div className="flex items-center gap-2">
                    <EyeClosedIcon /> Unhide column
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <EyeIcon /> Hide column
                  </div>
                )}
              </MenuItem>

              <MenuItem
                value="delete"
                variant="destructive"
                className={cn("hidden", !isMember && "flex")}
                onClick={() => {
                  setColumnToDelete?.(column);
                  setIsDeleteColumnDialogOpen(true);
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
            state.isDefaultValue,
          ]}
        >
          {([canSubmit, isSubmitting, isDefaultValue]) => (
            <div className="ml-2 flex items-center justify-center">
              <Tooltip
                tooltip="Cancel"
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      onSetActive(null);
                      form.reset();
                    }}
                    disabled={isSubmitting}
                    className="focus-visible:ring-offset-0"
                  >
                    <XIcon />
                  </Button>
                }
              />

              <Tooltip
                tooltip="Save"
                trigger={
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    disabled={!canSubmit || isSubmitting || isDefaultValue}
                    className="focus-visible:ring-offset-0"
                  >
                    <CheckIcon />
                  </Button>
                }
              />
            </div>
          )}
        </form.Subscribe>
      )}
    </form>
  );
};

export default ColumnForm;
