import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useRouteContext } from "@tanstack/react-router";
import { format } from "date-fns";
import { MoreHorizontalIcon, PenLineIcon, Trash2Icon } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";

import { RichTextEditor } from "@/components/core";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
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
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { useDeletePostMutation } from "@/generated/graphql";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import taskOptions from "@/lib/options/task.options";
import { cn } from "@/lib/utils";
import CommentEmojiPicker from "./CommentEmojiPicker";
import PostEmojis from "./PostEmojis";
import UpdateCommentForm from "./UpdateCommentForm";

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

  const endRef = useRef<HTMLDivElement | null>(null);
  const prevLengthRef = useRef<number>(task?.posts?.nodes?.length ?? 0);

  const taskQueryKey = taskOptions({ rowId: taskId }).queryKey;

  const { mutate: deletePost } = useDeletePostMutation({
    meta: {
      invalidates: [taskQueryKey],
    },
  });

  const {
    isOpen: isDeleteCommentDialogOpen,
    setIsOpen: setIsDeleteCommentDialogOpen,
  } = useDialogStore({
    type: DialogType.DeleteComment,
  });

  useEffect(() => {
    const currentLength = task?.posts?.nodes?.length ?? 0;

    // Only scroll if a comment was added (length increased)
    if (currentLength > prevLengthRef.current) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    // Update previous length
    prevLengthRef.current = currentLength;
  }, [task?.posts?.nodes?.length]);

  return (
    <>
      <CardRoot className="p-0 shadow-none">
        <CardHeader className="flex h-10 flex-row items-center justify-between rounded-t-xl border-b bg-base-50 px-3 dark:bg-base-800">
          <h3 className="font-medium text-base-900 text-sm dark:text-base-100">
            Comments
          </h3>
        </CardHeader>

        <CardContent className="no-scrollbar max-h-120 overflow-auto p-0">
          {task?.posts?.nodes?.length ? (
            <div className="grid gap-0">
              {task?.posts?.nodes?.map((post, index) => {
                const isUsersPost = post.authorId === session?.user?.rowId;

                return (
                  <div
                    key={post?.rowId}
                    className={cn(
                      "group relative flex w-full p-3",
                      index === task.posts.nodes.length - 1
                        ? "border-0"
                        : "border-b",
                    )}
                  >
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <AvatarRoot size="xs" className="size-6! border">
                          <AvatarImage
                            src={post?.author?.avatarUrl ?? undefined}
                            alt={post?.author?.name}
                          />
                          <AvatarFallback>
                            {post?.author?.name.charAt(0)}
                          </AvatarFallback>
                        </AvatarRoot>
                        <span className="font-medium text-base-900 text-sm dark:text-base-100">
                          {post?.author?.name ?? "Anonymous"}
                        </span>

                        <span className="text-base-500 text-xs dark:text-base-400">
                          {format(new Date(post.createdAt!), "MMM d, yyyy")}
                        </span>

                        <div className="ml-auto flex items-center gap-2">
                          {isUsersPost && (
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
                                  aria-label="More options"
                                >
                                  <MoreHorizontalIcon />
                                </Button>
                              </MenuTrigger>

                              <MenuPositioner>
                                <MenuContent className="focus-within:outline-none">
                                  <MenuItem
                                    value="edit"
                                    onClick={() => setActivePostId(post.rowId!)}
                                  >
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
                          )}
                        </div>
                      </div>

                      {isUsersPost ? (
                        <UpdateCommentForm
                          post={{
                            authorId: post.authorId!,
                            description: post.description!,
                            rowId: post.rowId,
                          }}
                          isActive={activePostId === post.rowId}
                          onSetActive={(id) => setActivePostId(id)}
                        />
                      ) : (
                        <RichTextEditor
                          defaultContent={post.description!}
                          className="min-h-0 border-0 p-0 px-3 py-2 text-foreground text-sm"
                          skeletonClassName="h-[38.75px]"
                          editable={false}
                        />
                      )}

                      <Suspense
                        fallback={<CommentEmojiPicker postId={post.rowId!} />}
                      >
                        <PostEmojis postId={post.rowId!} />
                      </Suspense>
                    </div>
                  </div>
                );
              })}

              <div ref={endRef} />
            </div>
          ) : (
            <p className="mx-auto flex place-self-center p-4 text-muted-foreground text-sm">
              Add a comment to start the discussion
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
