import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { SmilePlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreatePostEmojiMutation } from "@/generated/graphql";
import useTheme from "@/lib/hooks/useTheme";
import userEmojisOptions from "@/lib/options/userEmojis.options";

interface Props {
  postId: string;
}

const CommentEmojiPicker = ({ postId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const { theme } = useTheme();

  const { data: userEmojis } = useQuery({
    ...userEmojisOptions({ postId, userId: session?.user.rowId! }),
    select: (data) => data?.emojis?.nodes.map((e) => e.emoji) ?? [],
  });

  const { mutate: createPostEmoji } = useCreatePostEmojiMutation({
    meta: {
      invalidates: [["all"]],
    },
  });

  return (
    <PopoverRoot
      lazyMount
      positioning={{
        strategy: "fixed",
        placement: "top",
      }}
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
      modal
    >
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="size-7 text-base-400"
          aria-label="Select Emoji"
        >
          <SmilePlusIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverPositioner>
        <PopoverContent className="h-full w-full rounded-xl border-0 p-0">
          <Picker
            navPosition="none"
            previewPosition="none"
            skinTonePosition="none"
            emojiButtonRadius="6px"
            autoFocus={true}
            data={data}
            theme={theme === "dark" ? "dark" : "light"}
            emojiSize={20}
            emojiButtonSize={30}
            perLine={10}
            onEmojiSelect={(emoji: { native: string }) => {
              if (!userEmojis?.includes(emoji.native)) {
                createPostEmoji({
                  input: {
                    emoji: {
                      postId,
                      userId: session?.user?.rowId!,
                      emoji: emoji.native,
                    },
                  },
                });
              }

              setIsOpen(false);
            }}
          />
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  );
};

export default CommentEmojiPicker;
