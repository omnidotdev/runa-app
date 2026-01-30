/**
 * Template selector for project creation.
 *
 * Displays a grid of pre-configured project templates that users
 * can select to quickly start with a sensible structure.
 */

import { ArrowRightIcon, SparklesIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** Project template definition (matches API structure). */
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  columns: Array<{
    title: string;
    icon?: string;
  }>;
  labels?: Array<{
    name: string;
    color: string;
  }>;
}

/** Pre-defined project templates. */
export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "software",
    name: "Software Development",
    description: "Track features, bugs, and sprints",
    icon: "💻",
    columns: [
      { title: "Backlog", icon: "📋" },
      { title: "To Do", icon: "📝" },
      { title: "In Progress", icon: "🚧" },
      { title: "Review", icon: "👀" },
      { title: "Done", icon: "✅" },
    ],
    labels: [
      { name: "Bug", color: "#ef4444" },
      { name: "Feature", color: "#3b82f6" },
    ],
  },
  {
    id: "kanban",
    name: "Kanban",
    description: "Simple three-column workflow",
    icon: "📋",
    columns: [
      { title: "To Do", icon: "📝" },
      { title: "Doing", icon: "🚀" },
      { title: "Done", icon: "✅" },
    ],
  },
  {
    id: "scrum",
    name: "Scrum Sprint",
    description: "Sprint-based agile workflow",
    icon: "🏃",
    columns: [
      { title: "Sprint Backlog", icon: "📋" },
      { title: "In Progress", icon: "🚧" },
      { title: "Testing", icon: "🧪" },
      { title: "Done", icon: "✅" },
    ],
  },
  {
    id: "marketing",
    name: "Marketing Campaign",
    description: "Plan and track campaigns",
    icon: "📢",
    columns: [
      { title: "Ideas", icon: "💡" },
      { title: "Planning", icon: "📝" },
      { title: "In Progress", icon: "🚀" },
      { title: "Published", icon: "✅" },
    ],
  },
  {
    id: "personal",
    name: "Personal / GTD",
    description: "Getting Things Done style",
    icon: "✨",
    columns: [
      { title: "Inbox", icon: "📥" },
      { title: "Today", icon: "🎯" },
      { title: "This Week", icon: "📅" },
      { title: "Done", icon: "✅" },
    ],
  },
  {
    id: "design",
    name: "Design Project",
    description: "UX/UI design workflow",
    icon: "🎨",
    columns: [
      { title: "Research", icon: "🔍" },
      { title: "Design", icon: "🎨" },
      { title: "Review", icon: "👀" },
      { title: "Approved", icon: "✅" },
    ],
  },
];

interface TemplateCardProps {
  template: ProjectTemplate;
  onClick: () => void;
}

function TemplateCard({
  template,
  onClick,
}: TemplateCardProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-2 rounded-lg border bg-background p-3 text-left transition-all hover:border-primary/50 hover:bg-muted/50 hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <span className="text-xl">{template.icon}</span>
        <ArrowRightIcon className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div>
        <h3 className="font-medium text-sm">{template.name}</h3>
        <p className="mt-0.5 text-muted-foreground text-xs">
          {template.description}
        </p>
      </div>
      <div className="flex flex-wrap gap-1">
        {template.columns.slice(0, 3).map((col, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
          >
            {col.icon && <span className="text-[8px]">{col.icon}</span>}
            {col.title}
          </span>
        ))}
        {template.columns.length > 3 && (
          <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            +{template.columns.length - 3}
          </span>
        )}
      </div>
    </button>
  );
}

interface TemplateSelectorProps {
  /** Called when a template is selected. */
  onSelect: (template: ProjectTemplate) => void;
  /** Called when user chooses to start from scratch. */
  onSkip: () => void;
  className?: string;
}

export function TemplateSelector({
  onSelect,
  onSkip,
  className,
}: TemplateSelectorProps): React.ReactElement {
  return (
    <div className={cn("flex flex-col gap-4 overflow-y-auto p-4", className)}>
      <div className="text-center">
        <h3 className="font-medium text-sm">Choose a template</h3>
        <p className="mt-1 text-muted-foreground text-xs">
          Start with a pre-configured structure or describe your own
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {PROJECT_TEMPLATES.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onClick={() => onSelect(template)}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 py-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-muted-foreground text-xs">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        onClick={onSkip}
        className="flex items-center justify-center gap-2 rounded-lg border border-dashed bg-background p-4 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/30 hover:text-foreground"
      >
        <SparklesIcon className="size-4" />
        <span className="text-sm">Start from scratch</span>
      </button>
    </div>
  );
}
