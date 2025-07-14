import { ark } from "@ark-ui/react";
import { Portal } from "@ark-ui/react/portal";
import { tv } from "tailwind-variants";

import {
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";
import type { VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] rounded-md font-medium text-sm outline-hidden transition-transform disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  variants: {
    variant: {
      solid: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
      secondary:
        "bg-base-100 dark:bg-base-700 text-foreground hover:bg-base-200 dark:hover:bg-base-800",
      outline:
        "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
      muted:
        "bg-muted border-none text-muted-foreground shadow-xs hover:bg-muted/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      destructive:
        "bg-red-500 text-destructive-foreground shadow-xs hover:bg-destructive/90",
    },
    size: {
      xs: "h-7 gap-1 rounded-sm px-2.5 has-[>svg]:px-2",
      sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
      md: "h-9 px-4 py-2 has-[>svg]:px-3",
      lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
      icon: "size-9",
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});

interface Props
  extends ComponentProps<typeof ark.button>,
    VariantProps<typeof buttonVariants> {
  tooltip?: string | ComponentProps<typeof TooltipContent>;
  placement?: "top" | "right" | "bottom" | "left";
}

const Button = ({
  className,
  variant,
  size,
  tooltip,
  placement = "top",
  ...rest
}: Props) => {
  const button = (
    <ark.button
      type="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...rest}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <TooltipRoot positioning={{ placement }} closeDelay={0} openDelay={100}>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <Portal>
        <TooltipPositioner>
          <TooltipContent {...tooltip} />
        </TooltipPositioner>
      </Portal>
    </TooltipRoot>
  );
};

export { Button, buttonVariants };
