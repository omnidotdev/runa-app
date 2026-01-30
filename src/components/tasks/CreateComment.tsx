import { useParams, useRouteContext } from "@tanstack/react-router";
import { SendIcon } from "lucide-react";
import { useRef } from "react";

import { RichTextEditor } from "@/components/core";
import { Button } from "@/components/ui/button";
import { useCreatePostMutation } from "@/generated/graphql";
import useForm from "@/lib/hooks/useForm";
import taskOptions from "@/lib/options/task.options";

import type { EditorApi } from "@/components/core";

interface CreateCommentProps {
  /** Called when a comment containing @mention is submitted (for polling). */
  onMentionSubmit: (html: string) => void;
}

const CreateComment = ({ onMentionSubmit }: CreateCommentProps) => {
  const editorApi = useRef<EditorApi | null>(null);
  const { taskId } = useParams({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const { mutate: addComment } = useCreatePostMutation({
    meta: {
      invalidates: [taskOptions({ rowId: taskId }).queryKey],
    },
  });

  const form = useForm({
    defaultValues: {
      comment: "",
    },
    onSubmit: ({ value, formApi }) => {
      const authorId = session?.user?.rowId;
      if (!authorId) return;

      if (value.comment.trim()) {
        addComment({
          input: {
            post: {
              taskId,
              authorId,
              description: value.comment,
            },
          },
        });

        // Start polling if comment contains a mention
        onMentionSubmit(value.comment);
      }

      formApi.reset();
      editorApi.current?.clearContent();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="relative flex w-full flex-col gap-2 pb-8"
    >
      <form.Field name="comment">
        {(field) => (
          <RichTextEditor
            editorApi={editorApi}
            onUpdate={({ getHTML }) => field.handleChange(getHTML())}
            placeholder="Add a comment... (type @runa to mention the AI agent)"
            enableMentions
            className="flex min-h-32 w-full rounded-xl border text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"
            skeletonClassName="h-[128px] w-full"
          />
        )}
      </form.Field>

      <div className="-mt-14 flex justify-end gap-2 p-2">
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
              size="sm"
              disabled={!canSubmit || isSubmitting || isDefaultValue}
              className="active:scale-[0.97]"
            >
              <SendIcon className="size-3" />
              Comment
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
};

export default CreateComment;
