import { useForm } from "@tanstack/react-form";
import { useParams, useRouteContext } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { useUpdatePostMutation } from "@/generated/graphql";
import taskOptions from "@/lib/options/task.options";
import { cn } from "@/lib/utils";

interface Props {
  post: {
    authorId: string;
    description: string;
    rowId: string;
  };
  isActive: boolean;
  onSetActive: (rowId: string | null) => void;
}

const UpdateCommentForm = ({ post, isActive, onSetActive }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    if (isActive && textareaRef.current) {
      requestAnimationFrame(() => {
        textareaRef.current?.focus({ preventScroll: true });
        textareaRef.current?.setSelectionRange(
          textareaRef.current.value.length,
          textareaRef.current.value.length,
        );
      });
    }
  }, [isActive]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-2"
    >
      <form.Field name="comment">
        {(field) => (
          // TODO: use RichTextEditor
          <textarea
            ref={(el) => {
              textareaRef.current = el;

              if (el) {
                // Reset height when inactive
                if (!isActive) {
                  el.style.height = "auto";
                  el.style.minHeight = "";
                } else {
                  el.style.height = "auto";
                  el.style.height = `${el.scrollHeight}px`;
                  // prevent shrinking
                  el.style.minHeight = `${el.scrollHeight}px`;
                }
              }
            }}
            value={field.state.value}
            onChange={(e) => {
              field.handleChange(e.target.value);

              if (isActive && textareaRef.current) {
                const el = textareaRef.current;
                el.style.height = "auto";
                el.style.height = `${el.scrollHeight}px`;
                // prevent shrinking
                el.style.minHeight = `${el.scrollHeight}px`;
              }
            }}
            placeholder="Add a comment..."
            className={cn(
              "field-sizing-content mt-1 flex h-auto w-full rounded-xl px-3 py-2 text-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
              !isActive
                ? "pointer-events-none resize-none border-0 shadow-none transition-none focus-visible:ring-0"
                : "bg-background",
            )}
            tabIndex={isActive ? 0 : -1}
            readOnly={!isActive}
          />
        )}
      </form.Field>

      {isActive && (
        <div className="mt-4 flex justify-end gap-2">
          <Button
            onClick={() => {
              onSetActive(null);
              form.reset();
            }}
            variant="outline"
            tabIndex={0}
          >
            Cancel
          </Button>

          <form.Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isSubmitting,
              state.isDirty,
            ]}
          >
            {([canSubmit, isSubmitting, isDirty]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting || !isDirty}
                tabIndex={0}
              >
                Update
              </Button>
            )}
          </form.Subscribe>
        </div>
      )}
    </form>
  );
};

export default UpdateCommentForm;
