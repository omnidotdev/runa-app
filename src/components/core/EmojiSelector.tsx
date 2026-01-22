import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { SmilePlusIcon, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";

import type { ComponentProps } from "react";

interface EmojiProps {
  id: string;
  keywords: string[];
  name: string;
  skins: { native: string; shortcodes: string; unified: string }[];
  version: number;
}

interface Props {
  value: string | null;
  onChange: (emoji: string | null) => void;
  triggerProps?: ComponentProps<typeof Button>;
  allowClear?: boolean;
}

const EmojiSelector = ({
  value,
  onChange,
  triggerProps,
  allowClear = true,
}: Props) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const isDisabled = triggerProps?.disabled;

  const allEmojis = useMemo(() => data, []);

  const getEmojiData = Object.values(
    // @ts-expect-error
    allEmojis.emojis,
  ).find((e) => {
    const emoji = e as EmojiProps;
    return emoji?.skins?.[0]?.native === value;
  }) as EmojiProps | undefined;

  return (
    <PopoverRoot
      lazyMount
      open={isOpen}
      onOpenChange={(e) => setIsOpen(e.open)}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "size-7 border border-transparent p-0 text-md transition-colors",
            !isDisabled &&
              "hover:border-border hover:bg-accent hover:text-base-600 dark:hover:text-base-300",
            isDisabled &&
              "cursor-default hover:border-transparent hover:bg-transparent",
          )}
          {...triggerProps}
        >
          {value ? (
            <span>{value}</span>
          ) : (
            <SmilePlusIcon className="size-4 text-base-400" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverPositioner>
        <PopoverContent className="no-scrollbar h-full w-full rounded-xl p-0">
          <div className="flex flex-col gap-0">
            <div className="flex items-center justify-center">
              {allowClear && value && (
                <div className="w-full">
                  <div className="flex w-full items-center justify-between gap-3 rounded-lg p-1 px-4">
                    <div className="flex items-center gap-2">
                      <div className="text-3xl" aria-hidden="true">
                        {value}
                      </div>
                      <p className="text-sm">{getEmojiData?.name}</p>
                    </div>

                    <Button
                      variant="ghost"
                      onClick={() => {
                        onChange(null);
                      }}
                      className="flex items-center gap-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Remove selected emoji"
                    >
                      <Trash2Icon className="size-4" />
                      <span className="font-medium text-sm">Remove</span>
                    </Button>
                  </div>

                  <hr />
                </div>
              )}
            </div>

            <Picker
              noResultsEmoji={value}
              navPosition="none"
              previewPosition="none"
              previewEmoji="none"
              skinTonePosition="search"
              emojiButtonRadius="6px"
              autoFocus={true}
              data={data}
              theme={theme === "dark" ? "dark" : "light"}
              emojiSize={20}
              emojiButtonSize={30}
              perLine={14}
              onEmojiSelect={(emoji: { native?: string; id?: string }) => {
                onChange(emoji.native || emoji.id || null);
              }}
              onEm
            />
          </div>
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  );
};

export default EmojiSelector;
