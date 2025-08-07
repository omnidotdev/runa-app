import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useRouteContext } from "@tanstack/react-router";
import { SmilePlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreatePostEmojiMutation } from "@/generated/graphql";
import useTheme from "@/lib/hooks/useTheme";

interface Props {
  postId: string;
}

const CommentEmojiPicker = ({ postId }: Props) => {
  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/$taskId",
  });

  const { theme } = useTheme();

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
    >
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" className="size-7 text-base-400">
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
            // biome-ignore lint/suspicious/noExplicitAny: Todo create type
            onEmojiSelect={(emoji: any) => {
              createPostEmoji({
                input: {
                  emoji: {
                    postId,
                    userId: session?.user?.rowId!,
                    emoji: emoji.native,
                  },
                },
              });
            }}
          />
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  );
};

export default CommentEmojiPicker;
