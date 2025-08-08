import { Format } from "@ark-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";

import CommentEmojiPicker from "@/components/tasks/CommentEmojiPicker";
import { Button } from "@/components/ui/button";
import {
  useCreatePostEmojiMutation,
  useDeletePostEmojiMutation,
} from "@/generated/graphql";
import postEmojisOptions from "@/lib/options/emoji.options";
import { cn } from "@/lib/utils";

interface Props {
  postId: string;
}

const PostEmojis = ({ postId }: Props) => {
  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const { data: postEmojis } = useSuspenseQuery({
    ...postEmojisOptions({ postId, userId: session?.user?.rowId! }),
    select: (data) => {
      const userEmojis = data.users?.nodes?.[0]?.emojis?.nodes ?? [];

      const groupedEmojis =
        data.emojis?.groupedAggregates?.map((group) => {
          const emoji = group.keys?.[0];
          const count = Number(group.distinctCount?.rowId || 0);
          const userEmoji = userEmojis.find((e) => e.emoji === emoji);

          return {
            emoji,
            count,
            userEmoji,
          };
        }) ?? [];

      return { groupedEmojis };
    },
  });

  const { mutate: deleteEmoji, isPending: isDeleteEmojiPending } =
      useDeletePostEmojiMutation({
        meta: {
          invalidates: [["all"]],
        },
      }),
    { mutate: createPostEmoji, isPending: isCreatePostEmojiPending } =
      useCreatePostEmojiMutation({
        meta: {
          invalidates: [["all"]],
        },
      });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <CommentEmojiPicker postId={postId} />

      {postEmojis.groupedEmojis.map(({ emoji, count, userEmoji }) => (
        <Button
          key={emoji}
          variant="ghost"
          size="xs"
          disabled={isCreatePostEmojiPending || isDeleteEmojiPending}
          onClick={() => {
            if (userEmoji) {
              deleteEmoji({ rowId: userEmoji.rowId });
            } else {
              createPostEmoji({
                input: {
                  emoji: {
                    userId: session?.user?.rowId!,
                    postId,
                    emoji,
                  },
                },
              });
            }
          }}
          className={cn(
            "inset-ring-1 inset-ring-border gap-2 rounded-full transition-transform active:scale-[0.95] disabled:opacity-100",
            userEmoji &&
              "inset-ring-primary-200 bg-primary-50 dark:inset-ring-primary-900 dark:bg-primary-950/80",
          )}
        >
          <span>{emoji}</span>

          {count > 1 && (
            <span className="tabular-nums">
              <Format.Number
                value={count}
                notation="compact"
                compactDisplay="short"
              />
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};

export default PostEmojis;
