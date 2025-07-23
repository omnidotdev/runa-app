import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarMenuShortcut } from "@/components/ui/sidebar";
import { Tooltip } from "@/components/ui/tooltip";

import type { ReactNode } from "react";

interface Props {
  title: string;
  count: number;
  tooltip: {
    title: string;
    shortCut?: string;
  };
  onCreate: () => void;
  emoji?: string | null;
  children?: ReactNode;
}

const ColumnHeader = ({
  emoji = "😀",
  title,
  count,
  tooltip,
  onCreate,
  children,
}: Props) => {
  return (
    <div className="z-10 mb-1 flex items-center justify-between rounded-lg border bg-background px-3 py-2 shadow-sm">
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
          positioning={{ placement: "top", gutter: 11 }}
          tooltip={{
            className: "bg-background text-foreground border",
            children: (
              <div className="inline-flex">
                {tooltip.title}
                {tooltip.shortCut && (
                  <div className="ml-2 flex items-center gap-0.5">
                    <SidebarMenuShortcut>
                      {tooltip.shortCut}
                    </SidebarMenuShortcut>
                  </div>
                )}
              </div>
            ),
          }}
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
    </div>
  );
};

export default ColumnHeader;
