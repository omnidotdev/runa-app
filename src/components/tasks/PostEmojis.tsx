import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
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

  const { mutate: deleteEmoji } = useDeletePostEmojiMutation({
      meta: {
        invalidates: [["all"]],
      },
    }),
    { mutate: createPostEmoji } = useCreatePostEmojiMutation({
      meta: {
        invalidates: [["all"]],
      },
    });

  if (!postEmojis) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {postEmojis.groupedEmojis.map(({ emoji, count, userEmoji }) => (
        <Tooltip
          key={emoji}
          disabled={!userEmoji}
          tooltip={userEmoji && "You've reacted with this emoji"}
          positioning={{
            placement: "bottom",
            strategy: "fixed",
          }}
        >
          <Button
            variant="ghost"
            size="xs"
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
              "gap-2 rounded-full active:scale-[0.95]",
              userEmoji && "bg-accent",
            )}
          >
            <span className="text-xl">{emoji}</span>

            {count > 1 && <span className="tabular-nums">{count}</span>}
          </Button>
        </Tooltip>
      ))}
    </div>
  );
};

export default PostEmojis;
