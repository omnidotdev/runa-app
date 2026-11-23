import { Button } from "@omnidotdev/thornberry/button";
import { PlusIcon } from "lucide-react";

import LabelIcon from "./LabelIcon";
import Tooltip from "./Tooltip";

import type { ComponentProps } from "react";

interface Props extends ComponentProps<typeof Button> {
  title: string;
  count: number;
  tooltip?: {
    title: string;
    shortcut?: string;
  };
  onCreate?: () => void;
  icon?: string | null;
}

/**
 * Column header.
 */
const ColumnHeader = ({
  icon,
  title,
  count,
  tooltip,
  onCreate,
  children,
  disabled,
  ...rest
}: Props) => (
  <div className="mb-1 flex items-center justify-between rounded-lg py-2">
    <div className="flex items-center gap-2">
      <LabelIcon icon={icon} className="size-4" />
      <h3 className="text-base-800 dark:text-base-100 text-sm font-semibold">
        {title}
      </h3>
      <span className="text-foreground flex size-7 items-center justify-center rounded-full text-xs font-semibold tabular-nums">
        {count}
      </span>
    </div>

    <div className="flex items-center gap-2">
      {children}

      {tooltip && onCreate && (
        <Tooltip
          positioning={{ placement: "top", gutter: 16 }}
          tooltip={tooltip.title}
          shortcut={tooltip.shortcut}
          trigger={
            <Button
              variant="ghost"
              className="size-7"
              onClick={() => !disabled && onCreate()}
              aria-label={`Create ${title}`}
              disabled={disabled}
              {...rest}
            >
              <PlusIcon className="size-4" />
            </Button>
          }
        />
      )}
    </div>
  </div>
);

export default ColumnHeader;
