import { ark } from "@ark-ui/react";

import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";

interface PropertyRowProps {
  label: string;
  children: ReactNode;
}

/**
 * A single label/value row in the task properties sidebar: a muted fixed-width
 * label on the left and the (possibly interactive) value on the right.
 */
export const PropertyRow = ({ label, children }: PropertyRowProps) => (
  <div className="flex items-start gap-2">
    <span className="w-20 shrink-0 select-none pt-1.5 text-muted-foreground text-xs">
      {label}
    </span>
    <div className="flex min-w-0 flex-1">{children}</div>
  </div>
);

/**
 * Borderless, full-width, left-aligned trigger used for each editable property.
 * Built on `ark.button` so it composes with `asChild` select/popover triggers.
 */
export const PropertyTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ark.button>) => (
  <ark.button
    type="button"
    className={cn(
      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-foreground text-sm outline-none transition-colors hover:bg-accent focus-visible:bg-accent data-[state=open]:bg-accent",
      className,
    )}
    {...rest}
  />
);

/** Static (read-only) property value with the same padding as a trigger. */
export const PropertyValue = ({
  className,
  ...rest
}: ComponentProps<"div">) => (
  <div
    className={cn(
      "flex w-full items-center gap-2 px-2 py-1.5 text-foreground text-sm",
      className,
    )}
    {...rest}
  />
);
