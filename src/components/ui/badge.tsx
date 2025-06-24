import { ark } from "@ark-ui/react";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";
import type { VariantProps } from "tailwind-variants";

const badgeVariants = tv({
  base: "inline-flex select-none items-center whitespace-nowrap rounded-md border font-semibold transition-colors",
  variants: {
    variant: {
      solid: "border-transparent bg-primary text-primary-foreground shadow-sm ",
      subtle:
        "border-transparent bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 shadow-sm ",
      outline: "text-foreground",
    },
    size: {
      sm: "h-5 gap-1 px-2 text-xs [&_svg]:size-3",
      md: "h-6 gap-1 px-2.5 text-xs [&_svg]:size-4",
      lg: "h-7 gap-1 px-3 text-sm [&_svg]:size-4",
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});

const Badge = ({
  className,
  variant,
  size,
  ...rest
}: ComponentProps<typeof ark.div> & VariantProps<typeof badgeVariants>) => (
  <ark.div
    className={cn(badgeVariants({ className, variant, size }))}
    {...rest}
  />
);

export {
  Badge,
  /** @knipignore */
  badgeVariants,
};
