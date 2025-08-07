import { useForm } from "@tanstack/react-form";
import { useParams, useRouteContext } from "@tanstack/react-router";
import {
  CheckIcon,
  MoreHorizontalIcon,
  PenLineIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { useUpdatePostMutation } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import taskOptions from "@/lib/options/task.options";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Tooltip } from "../ui/tooltip";

interface Props {
  post: {
    authorId: string;
    description: string;
    rowId: string;
  };
  isActive: boolean;
  onSetActive: (rowId: string | null) => void;
  setCommentToDelete: (rowId: string | null) => void;
}

const UpdateCommentForm = ({
  post,
  isActive,
  onSetActive,
  setCommentToDelete,
}: Props) => {
  const { taskId } = useParams({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const { mutate: updateComment } = useUpdatePostMutation({
    meta: {
      invalidates: [taskOptions({ rowId: taskId }).queryKey],
    },
  });

  const { setIsOpen: setIsDeleteCommentDialogOpen } = useDialogStore({
    type: DialogType.DeleteComment,
  });

  const form = useForm({
    defaultValues: {
      comment: post.description ?? "",
    },
    onSubmit: ({ value, formApi }) => {
      if (post.authorId !== session?.user?.rowId) return;

      updateComment({
        input: {
          rowId: post.rowId!,
          patch: {
            description: value.comment,
          },
        },
      });

      onSetActive(null);
      formApi.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex w-full items-center gap-2"
    >
      <form.Field name="comment">
        {(field) => (
          <Input
            type="text"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Add a comment..."
            className={cn(
              "w-full",
              !isActive &&
                "pointer-events-none border-0 shadow-none transition-none focus-visible:ring-0",
            )}
            tabIndex={isActive ? 0 : -1}
            readOnly={!isActive}
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
              className="size-7 text-base-400"
            >
              <MoreHorizontalIcon />
            </Button>
          </MenuTrigger>

          <MenuPositioner>
            <MenuContent className="focus-within:outline-none">
              <MenuItem value="edit" onClick={() => onSetActive(post.rowId!)}>
                <PenLineIcon />
                <span> Edit</span>
              </MenuItem>

              <MenuItem
                value="delete"
                variant="destructive"
                onClick={() => {
                  setCommentToDelete?.(post.rowId!);
                  setIsDeleteCommentDialogOpen(true);
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
            <div className="ml-2 flex items-center justify-center">
              <Tooltip tooltip="Cancel">
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
              </Tooltip>

              <Tooltip tooltip="Save">
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  disabled={!canSubmit || isSubmitting || !isDirty}
                  className="focus-visible:ring-offset-0"
                >
                  <CheckIcon />
                </Button>
              </Tooltip>
            </div>
          )}
        </form.Subscribe>
      )}
    </form>
  );
};

export default UpdateCommentForm;
