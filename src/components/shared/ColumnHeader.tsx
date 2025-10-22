import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";

import type { ButtonProps } from "@/components/ui/button";

interface Props extends ButtonProps {
  title: string;
  count: number;
  tooltip: {
    title: string;
    shortCut?: string;
  };
  onCreate: () => void;
  emoji?: string | null;
}

const ColumnHeader = ({
  emoji = "😀",
  title,
  count,
  tooltip,
  onCreate,
  children,
  ...rest
}: Props) => {
  return (
    <div className="mb-1 flex items-center justify-between rounded-lg border bg-background px-3 py-2">
      <div className="flex items-center gap-2">
        <span>{emoji}</span>
        <h3 className="font-semibold text-base-800 text-sm dark:text-base-100">
          {title}
        </h3>
        <span className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground text-xs tabular-nums">
          {count}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {children}

        <Tooltip
          positioning={{ placement: "top", gutter: 16 }}
          tooltip={tooltip.title}
          shortcut={tooltip.shortCut}
        >
          <Button
            variant="ghost"
            size="xs"
            className="size-7"
            onClick={onCreate}
            aria-label={`Create ${title}`}
            {...rest}
          >
            <PlusIcon className="size-4" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ColumnHeader;
