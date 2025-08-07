import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useRouteContext } from "@tanstack/react-router";
import { format } from "date-fns";
import { useState } from "react";

import RichTextEditor from "@/components/core/RichTextEditor";
import UpdateCommentForm from "@/components/tasks/UpdateCommentForm";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardRoot } from "@/components/ui/card";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeletePostMutation } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import taskOptions from "@/lib/options/task.options";

const Comments = () => {
  const { taskId } = useParams({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const { data: task } = useSuspenseQuery({
    ...taskOptions({ rowId: taskId }),
    select: (data) => data?.task,
  });

  const { mutate: deletePost } = useDeletePostMutation({
    meta: {
      invalidates: [["all"]],
    },
  });

  const {
    isOpen: isDeleteCommentDialogOpen,
    setIsOpen: setIsDeleteCommentDialogOpen,
  } = useDialogStore({
    type: DialogType.DeleteComment,
  });

  return (
    <>
      <CardRoot className="overflow-hidden p-0 shadow-none">
        <CardHeader className="flex h-10 flex-row items-center justify-between bg-base-50 px-3 dark:bg-base-800">
          <h3 className="font-medium text-base-900 text-sm dark:text-base-100">
            Comments
          </h3>
        </CardHeader>

        <CardContent className="flex items-center p-0">
          {task?.posts?.nodes?.length ? (
            <div className="w-full">
              {task?.posts?.nodes?.map((comment) => {
                const isUsersPost = comment.authorId === session?.user?.rowId;

                return (
                  <div key={comment?.rowId} className="flex w-full gap-2 p-2">
                    <Avatar
                      fallback={comment?.author?.name.charAt(0)}
                      src={comment?.author?.avatarUrl ?? undefined}
                      alt={comment?.author?.name}
                      size="sm"
                      className="rounded-full border-2 border-base-100 dark:border-base-900"
                    />

                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-baseline gap-3">
                        <span className="font-medium text-base text-base-900 dark:text-base-100">
                          {comment?.author?.name}
                        </span>
                        <span className="text-base-500 text-xs dark:text-base-400">
                          {format(
                            new Date(comment.createdAt!),
                            "MMM d, yyyy 'at' h:mm a",
                          )}
                        </span>
                      </div>

                      {comment.rowId}

                      {isUsersPost ? (
                        <UpdateCommentForm
                          post={{
                            authorId: comment.authorId,
                            description: comment.description!,
                            rowId: comment.rowId,
                          }}
                          isActive={activePostId === comment.rowId}
                          onSetActive={(id) => setActivePostId(id)}
                          setCommentToDelete={setCommentToDelete}
                        />
                      ) : (
                        <RichTextEditor
                          defaultContent={comment.description!}
                          className="min-h-0 border-0 p-0 py-2 text-sm leading-relaxed"
                          skeletonClassName="h-[38.75px]"
                          editable={false}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mx-auto flex place-self-center p-4 text-muted-foreground text-sm">
              No Comment. Add a comment to start the discussion.
            </p>
          )}
        </CardContent>
      </CardRoot>

      <DialogRoot
        open={isDeleteCommentDialogOpen}
        onOpenChange={(details) => {
          setIsDeleteCommentDialogOpen(details.open);
        }}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent className="w-full max-w-md rounded-lg bg-background">
            <DialogCloseTrigger />

            <div className="mb-4 flex flex-col gap-4">
              <DialogTitle>Danger Zone</DialogTitle>
              <DialogDescription>
                This will delete your comment. This action cannot be undone.
              </DialogDescription>
            </div>

            <Button
              type="submit"
              variant="destructive"
              onClick={() => {
                deletePost({ rowId: commentToDelete! });
                setIsDeleteCommentDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </>
  );
};

export default Comments;
