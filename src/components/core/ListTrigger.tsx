import { ChevronRightIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import Tooltip from "./Tooltip";

import type { MouseEventHandler } from "react";
import type { ButtonProps } from "@/components/ui/button";

interface Props extends ButtonProps {
  title: string;
  count: number;
  tooltip: {
    title: string;
    shortcut?: string;
  };
  onCreate: MouseEventHandler<HTMLButtonElement>;
  emoji?: string | null;
}

const ListTrigger = ({
  emoji = "😀",
  title,
  count,
  tooltip,
  onCreate,
  children,
  className,
  ...rest
}: Props) => {
  return (
    <CollapsibleTrigger
      asChild
      className="rounded-t-lg focus-visible:ring-inset"
    >
      <div
        role="button"
        tabIndex={0}
        className="flex items-center justify-between px-3 py-2"
      >
        <div className="flex items-center gap-2">
          <p className="text-xs">{emoji}</p>

          <h3 className="text-base-800 text-sm dark:text-base-100">{title}</h3>

          <span className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground text-xs tabular-nums">
            {count}
          </span>
        </div>

        <div className="mr-2 ml-auto flex items-center gap-4">
          {children}

          <Tooltip
            positioning={{ placement: "left", gutter: 11 }}
            tooltip={tooltip.title}
            shortcut={tooltip.shortcut}
            trigger={
              <Button
                variant="ghost"
                className={cn("size-7", className)}
                onClick={onCreate}
                aria-label="Create"
                {...rest}
              >
                <PlusIcon className="size-4" />
              </Button>
            }
          />
        </div>

        <ChevronRightIcon className="ml-2 size-5 text-base-400 transition-transform" />
      </div>
    </CollapsibleTrigger>
  );
};

export default ListTrigger;
