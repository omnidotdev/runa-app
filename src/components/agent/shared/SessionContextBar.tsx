import { HistoryIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

interface SessionContextBarProps {
  sessionTitle?: string;
  isNewSession: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Inline session context bar with history button.
 *
 * Shows the current session title (or "New conversation" for new sessions)
 * with a history button that opens a popover with session list.
 */
export function SessionContextBar({
  sessionTitle,
  isNewSession,
  children,
  className,
}: SessionContextBarProps) {
  const displayTitle = isNewSession
    ? "New conversation"
    : sessionTitle || "Conversation";

  return (
    <div
      className={cn(
        "flex items-center justify-between border-b bg-muted/30 px-4 py-1.5",
        className,
      )}
    >
      <span className="truncate text-muted-foreground text-xs">
        {displayTitle}
      </span>

      <PopoverRoot positioning={{ placement: "bottom-end" }}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 gap-1 px-2 text-xs"
            aria-label="Browse session history"
          >
            <HistoryIcon className="size-3" />
            <span className="hidden sm:inline">History</span>
          </Button>
        </PopoverTrigger>
        <PopoverPositioner>
          <PopoverContent className="w-72 p-3">{children}</PopoverContent>
        </PopoverPositioner>
      </PopoverRoot>
    </div>
  );
}
