import { useParams, useRouteContext } from "@tanstack/react-router";
import { SendIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreatePostMutation } from "@/generated/graphql";
import useForm from "@/lib/hooks/useForm";
import taskOptions from "@/lib/options/task.options";

const CreateComment = () => {
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
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="mb-8 flex w-full flex-col gap-2 px-1"
    >
      <form.Field name="comment">
        {(field) => (
          <Input
            type="text"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Add a comment..."
          />
        )}
      </form.Field>

      <div className="mt-4 flex justify-end gap-2">
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
