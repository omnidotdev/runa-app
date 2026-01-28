import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { SmilePlusIcon, XIcon } from "lucide-react";
import { useState } from "react";

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
        <PopoverContent className="h-full w-full rounded-xl border-0 p-0">
          <div className="flex flex-col">
            {allowClear && value && (
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 border-b px-3 py-2 text-base-500 text-sm transition-colors hover:bg-accent hover:text-base-700 dark:hover:text-base-300"
              >
                <XIcon className="size-4" />
                Remove emoji
              </button>
            )}
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
              onEmojiSelect={(emoji: { native?: string; id?: string }) => {
                onChange(emoji.native || emoji.id || null);
                setIsOpen(false);
              }}
            />
          </div>
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  );
};

/** @knipignore */
export default EmojiSelector;
