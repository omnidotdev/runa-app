import { DialogTrigger } from "@ark-ui/react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { SmilePlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { DialogContent, DialogPositioner, DialogRoot } from "../ui/dialog";

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
    <DialogRoot
      lazyMount
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button
          variant="unstyled"
          size="icon"
          className={cn(
            "border-0 text-md transition-colors duration-200 focus-visible:border-2 focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0",
            isDisabled
              ? "cursor-default opacity-100!"
              : "border border-primary bg-background",
          )}
          {...triggerProps}
        >
          {value ? (
            <span className="text-xl">{value}</span>
          ) : (
            <SmilePlusIcon className="size-5 text-muted-foreground" />
          )}
        </Button>
      </DialogTrigger>

      <DialogPositioner>
        <DialogContent className="no-scrollbar w-fit rounded-xl p-0">
          <div className="flex flex-col gap-0">
            <div className="flex items-center justify-center">
              {allowClear && value && (
                <div className="w-full">
                  <div className="flex w-full items-center justify-between gap-3 rounded-lg p-1 px-3">
                    <div className="text-3xl" aria-hidden="true">
                      {value}
                    </div>

                    <Button
                      variant="ghost"
                      onClick={() => {
                        onChange(null);
                        setIsOpen(false);
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
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

/** @knipignore */
export default EmojiSelector;
