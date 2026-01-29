import {
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ModelBadgeProps {
  modelId: string;
  modelName?: string;
  className?: string;
}

/**
 * Display-only model badge pill with tooltip for full model info.
 *
 * Shows a compact model name (e.g., "Claude 4.5") in a subtle pill,
 * with the full model ID visible on hover via tooltip.
 */
export function ModelBadge({ modelId, modelName, className }: ModelBadgeProps) {
  // Extract display name from model ID if not provided
  const displayName = modelName ?? formatModelName(modelId);

  return (
    <TooltipRoot>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-flex cursor-default items-center rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs",
            className,
          )}
        >
          {displayName}
        </span>
      </TooltipTrigger>
      <TooltipPositioner>
        <TooltipContent>
          <span className="font-mono text-xs">{modelId}</span>
        </TooltipContent>
      </TooltipPositioner>
    </TooltipRoot>
  );
}

/**
 * Formats a model ID into a human-readable display name.
 * e.g., "claude-sonnet-4-20250514" -> "Claude Sonnet 4"
 */
function formatModelName(modelId: string): string {
  // Handle common Claude model patterns
  if (modelId.includes("claude")) {
    const parts = modelId.split("-");
    const relevantParts: string[] = [];

    for (const part of parts) {
      // Skip date suffixes (e.g., "20250514")
      if (/^\d{8}$/.test(part)) continue;
      // Skip version suffixes like "4" at the end after date
      if (relevantParts.length > 2 && /^\d+$/.test(part)) continue;

      // Capitalize and add
      relevantParts.push(part.charAt(0).toUpperCase() + part.slice(1));
    }

    return relevantParts.join(" ");
  }

  // Fallback: capitalize first letter of each word
  return modelId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
