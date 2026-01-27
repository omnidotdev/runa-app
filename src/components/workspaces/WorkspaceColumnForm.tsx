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
import { useEffect, useRef, useState } from "react";

import { IconSelector, Tooltip } from "@/components/core";
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
  useCreateProjectColumnMutation,
  useProjectColumnsQuery,
  useUpdateProjectColumnMutation,
} from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import useForm from "@/lib/hooks/useForm";
import { Role } from "@/lib/permissions";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
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

  const { organizationId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/settings",
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
        invalidates: [getQueryKeyPrefix(useProjectColumnsQuery)],
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
        invalidates: [getQueryKeyPrefix(useProjectColumnsQuery)],
      },
      onError: (error) => console.error(error),
    });

  const form = useForm({
    defaultValues: {
      title: column.title,
      icon: column.icon as string | null,
      index: column.index,
    },
    onSubmit: ({ value, formApi }) => {
      if (column.rowId === "pending") {
        createProjectColumn({
          input: {
            projectColumn: {
              organizationId: organizationId!,
              title: value.title,
              index: value.index,
              icon: value.icon,
            },
          },
        });
      } else {
        setLocalColumns((prev) =>
          prev.map((c) =>
            c.rowId === column.rowId
              ? { ...c, title: value.title, icon: value.icon }
              : c,
          ),
        );

        updateColumn({
          rowId: column.rowId!,
          patch: {
            title: value.title,
            index: value.index,
            icon: value.icon,
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
      )}
    >
      <div
        {...attributes}
        {...listeners}
        role="button"
        tabIndex={0}
        aria-describedby={`DndDescribedBy-${column.rowId}`}
        className={cn(
          "mr-1 h-9 cursor-move items-center justify-center rounded-sm outline-hidden transition-[color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:ring-offset-background",
          canDrag ? "flex" : "invisible",
          isMember && "hidden",
        )}
        aria-label="Drag handle"
      >
        <GripVerticalIcon className="size-3 text-muted-foreground" />
      </div>

      <form.Field name="icon">
        {(field) => (
          <IconSelector
            value={field.state.value}
            onChange={(icon) => field.handleChange(icon)}
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
            id="column-title-input"
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
              className={cn(
                "hidden size-7 text-base-400 opacity-0 group-hover:opacity-100",
                !isMember && "inline-flex",
              )}
              tabIndex={isHovering ? 0 : -1}
              aria-label="More column options"
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
                    aria-label="Cancel"
                  >
                    <XIcon size={12} />
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
                    aria-label="Save"
                  >
                    <CheckIcon size={12} />
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
