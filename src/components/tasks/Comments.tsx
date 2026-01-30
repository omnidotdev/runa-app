import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useRouteContext } from "@tanstack/react-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  BotIcon,
  MessageCircleReplyIcon,
  MoreHorizontalIcon,
  PenLineIcon,
  Trash2Icon,
} from "lucide-react";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { MentionProcessingBadge } from "@/components/agent/MentionProcessingBadge";
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
import { useMentionPolling } from "@/lib/hooks/useMentionPolling";
import taskOptions from "@/lib/options/task.options";
import { cn } from "@/lib/utils";
import CreateComment from "./CreateComment";
import PostEmojis from "./PostEmojis";
import { ReplyForm } from "./ReplyForm";
import UpdateCommentForm from "./UpdateCommentForm";

import type { TaskQuery } from "@/generated/graphql";

dayjs.extend(relativeTime);

type PostNode = NonNullable<TaskQuery["task"]>["posts"]["nodes"][number];

interface CommentThread {
  parent: PostNode;
  replies: PostNode[];
}

function CommentItem({
  post,
  isReply = false,
  isUsersPost,
  activePostId,
  onSetActivePost,
  onReply,
  onDelete,
}: {
  post: PostNode;
  isReply?: boolean;
  isUsersPost: boolean;
  activePostId: string | null;
  onSetActivePost: (id: string | null) => void;
  onReply?: () => void;
  onDelete: (id: string) => void;
}) {
  const postId = post.rowId!;
  const isAgent = !post.author;

  return (
    <div
      className={cn(
        "group flex gap-2.5",
        isReply && "ml-9 border-base-200 border-l-2 pl-3 dark:border-base-700",
      )}
    >
      {/* Avatar */}
      {isAgent ? (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
          <BotIcon className="size-3.5 text-primary" />
        </div>
      ) : (
        <AvatarRoot size="xs" className="size-7! shrink-0">
          <AvatarImage
            src={post.author?.avatarUrl ?? undefined}
            alt={post.author?.name ?? "User"}
          />
          <AvatarFallback className="text-[11px]">
            {post.author?.name?.charAt(0).toUpperCase() ?? "U"}
          </AvatarFallback>
        </AvatarRoot>
      )}

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-1">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                "font-medium text-[13px]",
                isAgent && "text-primary",
              )}
            >
              {post.author?.name ?? "Runa"}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {dayjs(post.createdAt).fromNow()}
            </span>
          </div>

          {/* Reply & Menu buttons - top right */}
          <div className="flex items-center gap-1">
            {!isReply && onReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReply}
                className="h-6 gap-1 px-1.5 text-[11px] text-muted-foreground"
              >
                <MessageCircleReplyIcon className="size-3" />
                Reply
              </Button>
            )}

            {isUsersPost && (
              <MenuRoot
                positioning={{ strategy: "fixed", placement: "bottom-start" }}
              >
                <MenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 text-muted-foreground"
                  >
                    <MoreHorizontalIcon className="size-3.5" />
                  </Button>
                </MenuTrigger>
                <MenuPositioner>
                  <MenuContent className="min-w-28">
                    <MenuItem
                      value="edit"
                      onClick={() => onSetActivePost(postId)}
                    >
                      <PenLineIcon className="size-3.5" />
                      Edit
                    </MenuItem>
                    <MenuItem
                      value="delete"
                      variant="destructive"
                      onClick={() => onDelete(postId)}
                    >
                      <Trash2Icon className="size-3.5" />
                      Delete
                    </MenuItem>
                  </MenuContent>
                </MenuPositioner>
              </MenuRoot>
            )}
          </div>
        </div>

        {/* Message */}
        <div className="text-[13px] text-foreground/90">
          {isUsersPost && activePostId === postId ? (
            <UpdateCommentForm
              post={{
                authorId: post.authorId!,
                description: post.description!,
                rowId: post.rowId,
              }}
              isActive={true}
              onSetActive={onSetActivePost}
            />
          ) : (
            <RichTextEditor
              defaultContent={post.description!}
              className="comment-prose min-h-0 border-0 bg-transparent p-0"
              skeletonClassName="h-4"
              editable={false}
            />
          )}
        </div>

        {/* Emoji reactions */}
        <div className="-ml-1">
          <Suspense fallback={null}>
            <PostEmojis postId={postId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

const Comments = () => {
  const { taskId } = useParams({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  const { data: task } = useSuspenseQuery({
    ...taskOptions({ rowId: taskId }),
    select: (data) => data?.task,
  });

  const threads = useMemo((): CommentThread[] => {
    const posts = task?.posts?.nodes ?? [];
    const threadMap = new Map<string, CommentThread>();
    const orphanReplies: PostNode[] = [];

    for (const post of posts) {
      if (!post.parentId) {
        threadMap.set(post.rowId!, { parent: post, replies: [] });
      }
    }

    for (const post of posts) {
      if (post.parentId) {
        const thread = threadMap.get(post.parentId);
        if (thread) {
          thread.replies.push(post);
        } else {
          orphanReplies.push(post);
        }
      }
    }

    const result = Array.from(threadMap.values());
    for (const orphan of orphanReplies) {
      result.push({ parent: orphan, replies: [] });
    }

    return result;
  }, [task?.posts?.nodes]);

  const endRef = useRef<HTMLDivElement | null>(null);
  const prevLengthRef = useRef<number>(task?.posts?.nodes?.length ?? 0);
  const taskQueryKey = taskOptions({ rowId: taskId }).queryKey;

  const { mutate: deletePost } = useDeletePostMutation({
    meta: { invalidates: [taskQueryKey] },
  });

  const { isOpen: isDeleteDialogOpen, setIsOpen: setIsDeleteDialogOpen } =
    useDialogStore({ type: DialogType.DeleteComment });

  // Polling for AI agent responses after @mention in replies
  const {
    onCommentSubmit,
    cancelPolling,
    isPolling,
    elapsedSeconds,
    timedOut,
  } = useMentionPolling({ taskId });

  useEffect(() => {
    const currentLength = task?.posts?.nodes?.length ?? 0;
    if (currentLength > prevLengthRef.current) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevLengthRef.current = currentLength;
  }, [task?.posts?.nodes?.length]);

  const handleReply = useCallback(
    (postId: string) => setReplyingToId(postId),
    [],
  );
  const handleCloseReply = useCallback(() => setReplyingToId(null), []);
  const handleDeleteClick = useCallback(
    (postId: string) => {
      setCommentToDelete(postId);
      setIsDeleteDialogOpen(true);
    },
    [setIsDeleteDialogOpen],
  );

  return (
    <>
      <CardRoot className="p-0 shadow-none">
        <CardHeader className="flex h-10 flex-row items-center gap-2 rounded-t-xl border-b bg-base-50 px-3 dark:bg-base-800">
          <h3 className="font-medium text-base-900 text-sm dark:text-base-100">
            Comments
          </h3>
          {threads.length > 0 && (
            <span className="p-1 text-muted-foreground text-xs tabular-nums">
              {task?.posts?.nodes?.length}
            </span>
          )}
          <MentionProcessingBadge
            isPolling={isPolling}
            elapsedSeconds={elapsedSeconds}
            timedOut={timedOut}
            onCancel={cancelPolling}
            className="ml-auto"
          />
        </CardHeader>

        <CardContent className="p-0">
          {threads.length > 0 ? (
            <div className="flex flex-col gap-4 p-3">
              {threads.map((thread) => (
                <div key={thread.parent.rowId} className="space-y-3">
                  <CommentItem
                    post={thread.parent}
                    isUsersPost={
                      thread.parent.authorId === session?.user?.rowId
                    }
                    activePostId={activePostId}
                    onSetActivePost={setActivePostId}
                    onReply={
                      session?.user?.rowId
                        ? () => handleReply(thread.parent.rowId!)
                        : undefined
                    }
                    onDelete={handleDeleteClick}
                  />

                  {/* Replies */}
                  {thread.replies.map((reply) => (
                    <CommentItem
                      key={reply.rowId}
                      post={reply}
                      isReply
                      isUsersPost={reply.authorId === session?.user?.rowId}
                      activePostId={activePostId}
                      onSetActivePost={setActivePostId}
                      onDelete={handleDeleteClick}
                    />
                  ))}

                  {/* Reply form */}
                  {replyingToId === thread.parent.rowId &&
                    session?.user?.rowId && (
                      <div className="ml-9 border-primary/30 border-l-2 pl-3">
                        <ReplyForm
                          taskId={taskId}
                          parentId={thread.parent.rowId!}
                          authorId={session.user.rowId}
                          onClose={handleCloseReply}
                          onMentionSubmit={onCommentSubmit}
                        />
                      </div>
                    )}
                </div>
              ))}
              <div ref={endRef} />
            </div>
          ) : (
            <p className="mx-auto flex place-self-center p-4 text-muted-foreground text-sm">
              No comments yet
            </p>
          )}
        </CardContent>
      </CardRoot>

      <CreateComment onMentionSubmit={onCommentSubmit} />

      {/* Delete dialog */}
      <DialogRoot
        open={isDeleteDialogOpen}
        onOpenChange={(details) => {
          setIsDeleteDialogOpen(details.open);
          if (!details.open) setCommentToDelete(null);
        }}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent className="w-full max-w-xs rounded-lg p-4">
            <DialogCloseTrigger />
            <DialogTitle className="font-medium text-sm">
              Delete comment?
            </DialogTitle>
            <DialogDescription className="mt-1 text-[13px] text-muted-foreground">
              This cannot be undone.
            </DialogDescription>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => {
                  if (commentToDelete) deletePost({ rowId: commentToDelete });
                  setIsDeleteDialogOpen(false);
                  setCommentToDelete(null);
                }}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </>
  );
};

export default Comments;
