import { SparklesIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface Suggestion {
  label: string;
  message: string;
}

interface EmptyStateProps {
  title: string;
  description: string;
  suggestions: Suggestion[];
  onSuggestionClick: (message: string) => void;
  className?: string;
}

/**
 * Reusable empty state for chat panels.
 *
 * Shows a sparkle icon with pulse animation, title, description,
 * and clickable suggestion chips that auto-send messages.
 */
export function EmptyState({
  title,
  description,
  suggestions,
  onSuggestionClick,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
        <SparklesIcon className="size-6 animate-subtle-pulse text-primary" />
      </div>

      <div className="max-w-[280px]">
        <p className="text-balance font-medium text-sm">{title}</p>
        <p className="mt-1 text-pretty text-muted-foreground text-xs">
          {description}
        </p>
      </div>

      <div className="mt-2 flex w-full max-w-[320px] flex-col gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.label}
            type="button"
            onClick={() => onSuggestionClick(suggestion.message)}
            className="group relative w-full rounded-lg border border-border bg-card px-4 py-2.5 text-left text-sm transition-all hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <span className="text-foreground">{suggestion.label}</span>
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              &rarr;
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
