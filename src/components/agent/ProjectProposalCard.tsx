import {
  ArrowRightIcon,
  CheckIcon,
  LayersIcon,
  ListTodoIcon,
  TagIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

/** Label color mapping to Tailwind classes. */
const LABEL_COLORS: Record<string, string> = {
  gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  red: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
  orange:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
  yellow:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
  green: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  purple:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  pink: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300",
};

/** Proposed column structure. */
interface ProposedColumn {
  title: string;
  icon?: string;
}

/** Proposed label structure. */
interface ProposedLabel {
  name: string;
  color: string;
}

/** Proposed initial task structure. */
interface ProposedTask {
  title: string;
  columnIndex: number;
  priority?: string;
  description?: string;
}

/** Full project proposal structure. */
export interface ProjectProposal {
  name: string;
  prefix: string;
  description?: string;
  columns: ProposedColumn[];
  labels?: ProposedLabel[];
  initialTasks?: ProposedTask[];
}

interface ProjectProposalCardProps {
  proposal: ProjectProposal;
}

/**
 * Visual preview card for a project proposal.
 *
 * Shows the proposed project structure including name, prefix,
 * columns (as workflow flow), labels, and initial tasks.
 */
export function ProjectProposalCard({ proposal }: ProjectProposalCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="border-border border-b px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-base text-foreground">
              {proposal.name}
            </h3>
            <p className="mt-0.5 text-muted-foreground text-xs">
              Task prefix: <span className="font-mono">{proposal.prefix}</span>
            </p>
          </div>
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <LayersIcon className="size-4" />
          </div>
        </div>
        {proposal.description && (
          <p className="mt-2 text-muted-foreground text-sm">
            {proposal.description}
          </p>
        )}
      </div>

      {/* Columns Flow */}
      <div className="border-border border-b px-4 py-3">
        <div className="mb-2 flex items-center gap-1.5 text-muted-foreground text-xs">
          <CheckIcon className="size-3" />
          <span className="font-medium">Workflow Columns</span>
          <span className="text-muted-foreground/60">
            ({proposal.columns.length})
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {proposal.columns.map((col, index) => (
            <div key={col.title} className="flex items-center">
              <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs">
                {col.icon && <span>{col.icon}</span>}
                <span className="font-medium">{col.title}</span>
              </div>
              {index < proposal.columns.length - 1 && (
                <ArrowRightIcon className="mx-1 size-3 text-muted-foreground/50" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Labels */}
      {proposal.labels && proposal.labels.length > 0 && (
        <div className="border-border border-b px-4 py-3">
          <div className="mb-2 flex items-center gap-1.5 text-muted-foreground text-xs">
            <TagIcon className="size-3" />
            <span className="font-medium">Labels</span>
            <span className="text-muted-foreground/60">
              ({proposal.labels.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {proposal.labels.map((label) => (
              <span
                key={label.name}
                className={cn(
                  "rounded-full px-2 py-0.5 font-medium text-xs",
                  LABEL_COLORS[label.color] ?? LABEL_COLORS.gray,
                )}
              >
                {label.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Initial Tasks */}
      {proposal.initialTasks && proposal.initialTasks.length > 0 && (
        <div className="px-4 py-3">
          <div className="mb-2 flex items-center gap-1.5 text-muted-foreground text-xs">
            <ListTodoIcon className="size-3" />
            <span className="font-medium">Initial Tasks</span>
            <span className="text-muted-foreground/60">
              ({proposal.initialTasks.length})
            </span>
          </div>
          <ul className="space-y-1">
            {proposal.initialTasks.slice(0, 5).map((task, index) => (
              <li
                key={`${task.title}-${index}`}
                className="flex items-center gap-2 text-sm"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-muted-foreground/30" />
                <span className="truncate text-foreground">{task.title}</span>
                <span className="shrink-0 text-muted-foreground text-xs">
                  in {proposal.columns[task.columnIndex]?.title ?? "Unknown"}
                </span>
              </li>
            ))}
            {proposal.initialTasks.length > 5 && (
              <li className="text-muted-foreground text-xs">
                +{proposal.initialTasks.length - 5} more tasks
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
