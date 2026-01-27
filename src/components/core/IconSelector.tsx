import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { SearchIcon, XIcon, icons } from "lucide-react";
import { useMemo, useState } from "react";

import LabelIcon from "@/components/core/LabelIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@/components/ui/tabs";
import parseIcon from "@/lib/util/parseIcon";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";

import type { ComponentProps } from "react";

// Popular/common Lucide icons for labels
const POPULAR_ICONS = [
  "bug",
  "sparkles",
  "zap",
  "rocket",
  "flag",
  "star",
  "heart",
  "bookmark",
  "alert-circle",
  "check-circle",
  "clock",
  "calendar",
  "folder",
  "file",
  "code",
  "database",
  "server",
  "cloud",
  "lock",
  "shield",
  "user",
  "users",
  "settings",
  "wrench",
  "hammer",
  "lightbulb",
  "target",
  "trending-up",
  "activity",
  "layers",
] as const;

// Convert kebab-case to PascalCase for icon lookup
const toIconName = (name: string): keyof typeof icons => {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("") as keyof typeof icons;
};

interface Props {
  value: string | null | undefined;
  onChange: (icon: string | null) => void;
  triggerProps?: ComponentProps<typeof Button>;
  disabled?: boolean;
}

const IconSelector = ({ value, onChange, triggerProps, disabled }: Props) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("emoji");

  const parsed = parseIcon(value);

  // Filter Lucide icons based on search
  const filteredIcons = useMemo(() => {
    const searchLower = search.toLowerCase();
    if (!search) return POPULAR_ICONS;

    return Object.keys(icons)
      .filter((name) => {
        // Convert PascalCase to kebab-case for searching
        const kebab = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
        return (
          kebab.includes(searchLower) ||
          name.toLowerCase().includes(searchLower)
        );
      })
      .slice(0, 60) // Limit results
      .map((name) => name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase());
  }, [search]);

  const handleSelectEmoji = (emoji: string) => {
    onChange(`emoji:${emoji}`);
    setIsOpen(false);
  };

  const handleSelectLucide = (iconName: string) => {
    onChange(`lucide:${iconName}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setIsOpen(false);
  };

  return (
    <PopoverRoot
      lazyMount
      open={isOpen}
      onOpenChange={(e) => setIsOpen(e.open)}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          disabled={disabled}
          className={cn(
            "size-7 border border-transparent p-0 text-md transition-colors",
            !disabled &&
              "hover:border-border hover:bg-accent hover:text-base-600 dark:hover:text-base-300",
            disabled &&
              "cursor-default hover:border-transparent hover:bg-transparent",
          )}
          {...triggerProps}
        >
          <LabelIcon icon={value} className="size-4 text-base-400" />
        </Button>
      </PopoverTrigger>
      <PopoverPositioner>
        <PopoverContent className="w-80 rounded-xl border p-0">
          <TabsRoot
            value={activeTab}
            onValueChange={(e) => setActiveTab(e.value)}
            className="w-full"
          >
            <div className="border-b px-2 pt-2">
              <TabsList className="h-9 gap-2">
                <TabsTrigger value="emoji" className="text-xs">
                  Emoji
                </TabsTrigger>
                <TabsTrigger value="lucide" className="text-xs">
                  Lucide
                </TabsTrigger>
                <TabsIndicator />
              </TabsList>
            </div>

            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="flex w-full items-center gap-2 border-b px-3 py-2 text-base-500 text-sm transition-colors hover:bg-accent hover:text-base-700 dark:hover:text-base-300"
              >
                <XIcon className="size-4" />
                Remove icon
              </button>
            )}

            <TabsContent value="emoji" className="mt-0">
              <Picker
                navPosition="none"
                previewPosition="none"
                skinTonePosition="none"
                emojiButtonRadius="6px"
                autoFocus={activeTab === "emoji"}
                data={data}
                theme={theme === "dark" ? "dark" : "light"}
                emojiSize={20}
                emojiButtonSize={30}
                perLine={9}
                onEmojiSelect={(emoji: { native?: string; id?: string }) => {
                  if (emoji.native) {
                    handleSelectEmoji(emoji.native);
                  }
                }}
              />
            </TabsContent>

            <TabsContent value="lucide" className="mt-0 p-2">
              <div className="relative mb-2">
                <SearchIcon className="absolute top-1/2 left-2 size-4 -translate-y-1/2 text-base-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search icons..."
                  className="h-8 pl-8 text-sm"
                  autoFocus={activeTab === "lucide"}
                />
              </div>
              <div className="grid max-h-64 grid-cols-6 gap-1 overflow-y-auto">
                {filteredIcons.map((iconName) => {
                  const IconComponent = icons[toIconName(iconName)];
                  if (!IconComponent) return null;

                  const isSelected =
                    parsed?.type === "lucide" && parsed.value === iconName;

                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => handleSelectLucide(iconName)}
                      className={cn(
                        "flex size-10 items-center justify-center rounded-md transition-colors hover:bg-accent",
                        isSelected && "bg-accent ring-2 ring-primary",
                      )}
                      title={iconName}
                    >
                      <IconComponent className="size-5" />
                    </button>
                  );
                })}
                {filteredIcons.length === 0 && (
                  <div className="col-span-6 py-8 text-center text-base-400 text-sm">
                    No icons found
                  </div>
                )}
              </div>
            </TabsContent>
          </TabsRoot>
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  );
};

export default IconSelector;
