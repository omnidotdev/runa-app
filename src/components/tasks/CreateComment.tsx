import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@omnidotdev/thornberry/avatar";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { SendIcon } from "lucide-react";
import { useRef, useState } from "react";

import { RichTextEditor } from "@/components/core";
import Shortcut from "@/components/core/Shortcut";
import { Button } from "@/components/ui/button";
import { useCreatePostMutation } from "@/generated/graphql";
import useForm from "@/lib/hooks/useForm";
import taskOptions from "@/lib/options/task.options";
import { submitOnModEnter } from "@/lib/util/submitOnEnter";
import { cn } from "@/lib/utils";

import type { RefObject } from "react";
import type { EditorApi } from "@/components/core";

interface CreateCommentProps {
  /** Shared editor handle so siblings can focus the composer */
  editorApi?: RefObject<EditorApi | null>;
}

/**
 * Platform-appropriate modifier key label for the send hint. Safe to read
 * `navigator` directly here: the hint only renders after the user has typed,
 * which is always client-side (never during SSR), so there is no hydration
 * mismatch.
 */
const getModKey = () =>
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad/i.test(navigator.userAgent)
    ? "⌘"
    : "Ctrl";

const CreateComment = ({
  editorApi: externalEditorApi,
}: CreateCommentProps) => {
  const internalEditorApi = useRef<EditorApi | null>(null);
  const editorApi = externalEditorApi ?? internalEditorApi;

  // Collapse to a slim single line until the composer is focused or has
  // content, then reveal the toolbar and actions (progressive disclosure), so
  // an untouched composer isn't a tall block of empty space.
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const isExpanded = isFocused || !isEmpty;

  const { taskId } = useLoaderData({
    from: "/_app/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const { session } = useRouteContext({
    from: "/_app/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
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
      if (value.comment.trim()) {
        addComment({
          input: {
            post: {
              taskId,
              authorId: session?.user?.rowId!,
              description: value.comment,
            },
          },
        });
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
      // send on Cmd/Ctrl+Enter, matching the market convention for thread composers
      onKeyDown={submitOnModEnter(() => form.handleSubmit())}
      className="flex w-full gap-3"
    >
      <AvatarRoot size="xs" className="mt-0.5 size-6! border">
        <AvatarImage
          src={session?.user?.image ?? undefined}
          alt={session?.user?.name}
        />
        <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
      </AvatarRoot>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <form.Field name="comment">
          {(field) => (
            <RichTextEditor
              editorApi={editorApi}
              onUpdate={({ getHTML, isEmpty: empty }) => {
                field.handleChange(getHTML());
                setIsEmpty(empty);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              hideToolbar={!isExpanded}
              imageUpload={{ taskId }}
              placeholder="Leave a comment..."
              className="w-full rounded-lg transition-[color,box-shadow] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 focus-within:ring-offset-background"
              editorClassName={cn(
                "max-h-64 overflow-y-auto",
                isExpanded ? "min-h-[44px]" : "min-h-0",
              )}
              skeletonClassName="h-9 w-full"
            />
          )}
        </form.Field>

        {isExpanded && (
          <div className="flex items-center justify-end gap-3">
            <form.Subscribe
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
                state.isDefaultValue,
              ]}
            >
              {([canSubmit, isSubmitting, isDefaultValue]) => (
                <>
                  {!isDefaultValue && (
                    <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                      <Shortcut className="ml-0">{getModKey()} ↵</Shortcut>
                      to send
                    </span>
                  )}

                  <Button
                    type="submit"
                    size="sm"
                    disabled={!canSubmit || isSubmitting || isDefaultValue}
                    className="active:scale-[0.97]"
                  >
                    <SendIcon className="size-3" />
                    Comment
                  </Button>
                </>
              )}
            </form.Subscribe>
          </div>
        )}
      </div>
    </form>
  );
};

export default CreateComment;
