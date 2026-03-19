import { SendIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import { RichTextEditor } from "@/components/core";
import { Button } from "@/components/ui/button";
import { useCreatePostMutation } from "@/generated/graphql";
import useForm from "@/lib/hooks/useForm";
import taskOptions from "@/lib/options/task.options";

import type { EditorApi } from "@/components/core";

interface ReplyFormProps {
  taskId: string;
  parentId: string;
  authorId: string;
  onClose: () => void;
  /** Called when a reply containing @mention is submitted (for polling). */
  onMentionSubmit: (html: string) => void;
}

export function ReplyForm({
  taskId,
  parentId,
  authorId,
  onClose,
  onMentionSubmit,
}: ReplyFormProps) {
  const editorApi = useRef<EditorApi | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { mutate: addReply, isPending } = useCreatePostMutation({
    meta: {
      invalidates: [taskOptions({ rowId: taskId }).queryKey],
    },
    onSuccess: onClose,
  });

  const form = useForm({
    defaultValues: { reply: "" },
    onSubmit: ({ value, formApi }) => {
      if (value.reply.trim()) {
        addReply({
          input: {
            post: { taskId, authorId, parentId, description: value.reply },
          },
        });
        onMentionSubmit(value.reply);
      }
      formApi.reset();
      editorApi.current?.clearContent();
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const editor = containerRef.current?.querySelector(
        '[contenteditable="true"]',
      );
      if (editor instanceof HTMLElement) editor.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-2"
      >
        <form.Field name="reply">
          {(field) => (
            <RichTextEditor
              editorApi={editorApi}
              onUpdate={({ getHTML }) => field.handleChange(getHTML())}
              placeholder="Reply..."
              enableMentions
              className="min-h-16 rounded-md border bg-background px-2.5 py-2 text-[13px]"
              skeletonClassName="h-16"
            />
          )}
        </form.Field>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-7 px-2 text-xs"
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
                size="sm"
                disabled={
                  !canSubmit || isSubmitting || isDefaultValue || isPending
                }
                className="h-7 gap-1 px-2 text-xs"
              >
                <SendIcon className="size-3" />
                Reply
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
}
