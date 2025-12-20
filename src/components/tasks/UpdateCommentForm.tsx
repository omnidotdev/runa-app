import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouteContext } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { RichTextEditor } from "@/components/core";
import { Button } from "@/components/ui/button";
import { useUpdatePostMutation } from "@/generated/graphql";
import taskOptions from "@/lib/options/task.options";
import { cn } from "@/lib/utils";

import type { EditorApi } from "@/components/core";

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
  const editorApi = useRef<EditorApi | null>(null);

  const { taskId } = useParams({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const queryClient = useQueryClient();
  const taskQueryKey = taskOptions({ rowId: taskId }).queryKey;

  const { mutateAsync: updateComment } = useUpdatePostMutation({
    meta: {
      invalidates: [taskQueryKey],
    },
    onMutate: (variables) => {
      queryClient.setQueryData(
        taskQueryKey,
        // @ts-expect-error TODO type properly
        (prev) => ({
          ...prev,
          task: {
            ...prev?.task,
            posts: {
              nodes: prev?.task?.posts.nodes.map((p) => {
                if (p.rowId === post.rowId) {
                  return {
                    ...p,
                    description: variables.input.patch.description,
                  };
                }

                return p;
              }),
            },
          },
        }),
      );
    },
    onSettled: () => {
      onSetActive(null);
      form.reset();
    },
  });

  const form = useForm({
    defaultValues: {
      comment: post.description,
    },
    onSubmit: async ({ value }) => {
      if (post.authorId !== session?.user?.rowId) return;

      await updateComment({
        input: {
          rowId: post.rowId!,
          patch: {
            description: value.comment,
          },
        },
      });
    },
  });

  useEffect(() => {
    if (isActive) {
      // NB: when `isActive` changes, `editor` from `RichTextEditor` can re-mounted, so we set a small delay before focusing the element
      setTimeout(() => editorApi.current?.focus(), 200);
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
          <RichTextEditor
            editorApi={editorApi}
            // NB: important to not use `field.state.value` for default content, because the `editor` uses `defaultContent` in the dependency array
            defaultContent={post.description}
            onUpdate={({ editor }) => {
              field.handleChange(editor.getHTML());
            }}
            className={cn(
              "field-sizing-content mt-1 flex h-auto min-h-9 w-full rounded-xl px-3 py-2 text-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
              !isActive
                ? "pointer-events-none resize-none border-0 shadow-none transition-none focus-visible:ring-0"
                : "bg-background",
            )}
            skeletonClassName="mt-1 h-9 w-full"
            tabIndex={isActive ? 0 : -1}
            editable={isActive}
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
              state.isDefaultValue,
            ]}
          >
            {([canSubmit, isSubmitting, isDefaultValue]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting || isDefaultValue}
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
