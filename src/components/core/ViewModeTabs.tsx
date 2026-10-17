import { CalendarIcon, Grid2X2Icon, ListIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ViewMode } from "@/lib/util/resolveViewModeToggle";

const OPTIONS: ReadonlyArray<{
  value: ViewMode;
  label: string;
  Icon: typeof ListIcon;
}> = [
  { value: "board", label: "Board", Icon: Grid2X2Icon },
  { value: "list", label: "List", Icon: ListIcon },
  { value: "calendar", label: "Calendar", Icon: CalendarIcon },
];

/**
 * Segmented control for the project view. One click jumps straight to any view
 * (vs. cycling through them), and the active view is highlighted. Labels are
 * shown from `sm` up and collapse to icons on narrow toolbars. The caller owns
 * the value (it lives in the URL), so this stays a controlled, presentational
 * component
 */
const ViewModeTabs = ({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (next: ViewMode) => void;
}) => (
  <div
    role="tablist"
    aria-label="View mode"
    className="inline-flex items-center gap-0.5 rounded-md border p-0.5"
  >
    {OPTIONS.map(({ value: optionValue, label, Icon }) => {
      const isActive = optionValue === value;

      return (
        <button
          key={optionValue}
          type="button"
          role="tab"
          aria-selected={isActive}
          aria-label={label}
          onClick={() => onChange(optionValue)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded px-2 py-1 font-medium text-sm transition-colors",
            isActive
              ? "bg-base-100 text-base-900 dark:bg-base-800 dark:text-base-100"
              : "text-base-500 hover:text-base-800 dark:hover:text-base-200",
          )}
        >
          <Icon className="size-4 shrink-0" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      );
    })}
  </div>
);

export default ViewModeTabs;
