import { ChevronRightIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { CollapsibleTrigger } from "../ui/collapsible";

import type { MouseEventHandler, ReactNode } from "react";

interface Props {
  title: string;
  count: number;
  tooltip: {
    title: string;
    shortCut?: string;
  };
  onCreate: MouseEventHandler<HTMLButtonElement>;
  emoji?: string | null;
  children?: ReactNode;
}

const ListTrigger = ({
  emoji = "😀",
  title,
  count,
  tooltip,
  onCreate,
  children,
}: Props) => {
  return (
    <CollapsibleTrigger className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center gap-2">
        <p className="text-xs">{emoji}</p>

        <h3 className="text-base-800 text-sm dark:text-base-100">{title}</h3>

        <span className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground text-xs tabular-nums">
          {count}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {children}

        <Tooltip
          positioning={{ placement: "left", gutter: 11 }}
          tooltip={tooltip.title}
          shortcut={tooltip.shortCut}
        >
          <Button
            variant="ghost"
            size="xs"
            className="size-5"
            onClick={onCreate}
          >
            <PlusIcon className="size-4" />
          </Button>
        </Tooltip>
      </div>

      <ChevronRightIcon className="ml-2 size-4 text-base-400 transition-transform" />
    </CollapsibleTrigger>
  );
};

export default ListTrigger;
