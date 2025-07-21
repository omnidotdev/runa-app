import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "@/providers/ThemeProvider";

import type { ComponentProps } from "react";

interface Props {
  value: string;
  onChange: (emoji: string) => void;
  triggerProps?: ComponentProps<typeof Button>;
}

const EmojiSelector = ({ value, onChange, triggerProps }: Props) => {
  const { theme } = useTheme();

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 text-base-400 text-md hover:text-base-600 dark:hover:text-base-300"
          {...triggerProps}
        >
          {value || " "}

          <ChevronDownIcon size={4} />
        </Button>
      </PopoverTrigger>
      <PopoverPositioner>
        <PopoverContent className="h-full w-full rounded-xl border-0 p-0">
          {/* TODO: option for removing emoji */}
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
            perLine={14}
            // biome-ignore lint/suspicious/noExplicitAny: Todo create type
            onEmojiSelect={(emoji: any) => onChange(emoji.native || emoji.id)}
          />
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  );
};

export default EmojiSelector;
