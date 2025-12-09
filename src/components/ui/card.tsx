import { ark } from "@ark-ui/react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const CardRoot = ({ className, ...rest }: ComponentProps<typeof ark.div>) => (
  <ark.div
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className,
    )}
    {...rest}
  />
);

const CardHeader = ({ className, ...rest }: ComponentProps<typeof ark.div>) => (
  <ark.div className={cn("flex flex-col gap-1.5 p-6", className)} {...rest} />
);

const CardTitle = ({ className, ...rest }: ComponentProps<typeof ark.div>) => (
  <ark.div
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...rest}
  />
);

const CardDescription = ({
  className,
  ...rest
}: ComponentProps<typeof ark.div>) => (
  <ark.div
    className={cn("text-muted-foreground text-sm", className)}
    {...rest}
  />
);

const CardContent = ({
  className,
  ...rest
}: ComponentProps<typeof ark.div>) => (
  <ark.div className={cn("p-6 pt-0", className)} {...rest} />
);

const CardFooter = ({ className, ...rest }: ComponentProps<typeof ark.div>) => (
  <ark.div className={cn("flex items-center p-6 pt-0", className)} {...rest} />
);

export {
  CardRoot,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
