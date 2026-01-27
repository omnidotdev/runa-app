import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import LabelIcon from "./LabelIcon";
import Tooltip from "./Tooltip";

import type { ButtonProps } from "@/components/ui/button";

interface Props extends ButtonProps {
  title: string;
  count: number;
  tooltip: {
    title: string;
    shortcut?: string;
  };
  onCreate: () => void;
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
      <h3 className="font-semibold text-base-800 text-sm dark:text-base-100">
        {title}
      </h3>
      <span className="flex size-7 items-center justify-center rounded-full font-semibold text-foreground text-xs tabular-nums">
        {count}
      </span>
    </div>

    <div className="flex items-center gap-2">
      {children}

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
    </div>
  </div>
);

export default ColumnHeader;
