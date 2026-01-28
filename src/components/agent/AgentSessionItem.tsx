import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { WrenchIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import type { AgentSessionNode } from "@/lib/ai/hooks/useAgentSessions";

dayjs.extend(relativeTime);

interface AgentSessionItemProps {
  session: AgentSessionNode;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export function AgentSessionItem({
  session,
  isActive,
  onSelect,
}: AgentSessionItemProps) {
  const title =
    session.title ||
    `Session ${dayjs(session.createdAt).format("MMM D, h:mm A")}`;
  const relativeTimestamp = dayjs(session.updatedAt).fromNow();

  return (
    <button
      type="button"
      role="option"
      aria-selected={isActive}
      onClick={() => onSelect(session.rowId)}
      className={cn(
        "flex w-full flex-col gap-1 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50",
        isActive && "bg-muted",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-medium">{title}</span>
        {session.toolCallCount > 0 && (
          <span className="flex shrink-0 items-center gap-1 text-muted-foreground text-xs">
            <WrenchIcon className="size-3" />
            {session.toolCallCount}
          </span>
        )}
      </div>
      <span className="text-muted-foreground text-xs">{relativeTimestamp}</span>
    </button>
  );
}
