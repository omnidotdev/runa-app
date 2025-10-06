import { ark } from "@ark-ui/react";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";

const cardVariants = tv({
  slots: {
    root: "rounded-xl border bg-card text-card-foreground shadow",
    header: "flex flex-col gap-1.5 p-6",
    title: "font-semibold leading-none tracking-tight",
    description: "text-muted-foreground text-sm",
    content: "p-6 pt-0",
    footer: "flex items-center p-6 pt-0",
  },
});

const {
  root,
  header,
  title: titleVariants,
  description: descriptionVariants,
  content,
  footer,
} = cardVariants();

const CardRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ark.div> & VariantProps<typeof root>) => (
  <ark.div className={cn(root(), className)} {...rest} />
);

const CardHeader = ({
  className,
  ...rest
}: ComponentProps<typeof ark.div> & VariantProps<typeof header>) => (
  <ark.div className={cn(header(), className)} {...rest} />
);

const CardTitle = ({
  className,
  ...rest
}: ComponentProps<typeof ark.div> & VariantProps<typeof titleVariants>) => (
  <ark.div className={cn(titleVariants(), className)} {...rest} />
);

const CardDescription = ({
  className,
  ...rest
}: ComponentProps<typeof ark.div> &
  VariantProps<typeof descriptionVariants>) => (
  <ark.div className={cn(descriptionVariants(), className)} {...rest} />
);

const CardContent = ({
  className,
  ...rest
}: ComponentProps<typeof ark.div> & VariantProps<typeof content>) => (
  <ark.div className={cn(content(), className)} {...rest} />
);

const CardFooter = ({
  className,
  ...rest
}: ComponentProps<typeof ark.div> & VariantProps<typeof footer>) => (
  <ark.div className={cn(footer(), className)} {...rest} />
);

interface CardProps extends ComponentProps<typeof CardRoot> {
  title?: string;
  description?: string;
  footer?: ReactNode;
  icon?: ReactNode;
  /**
   * @remarks `ComponentProps<typeof CardHeader>`
   */
  headerProps?: ComponentProps<typeof CardHeader>;
  /**
   * @remarks `ComponentProps<typeof CardTitle>`
   */
  titleProps?: ComponentProps<typeof CardTitle>;
  /**
   * @remarks `ComponentProps<typeof CardDescription>`
   */
  descriptionProps?: ComponentProps<typeof CardDescription>;
  /**
   * @remarks `ComponentProps<typeof CardContent>`
   */
  contentProps?: ComponentProps<typeof CardContent>;
  /**
   * @remarks `ComponentProps<typeof CardFooter>`
   */
  footerProps?: ComponentProps<typeof CardFooter>;
}

const Card = ({
  title,
  description,
  footer,
  icon,
  headerProps,
  titleProps,
  descriptionProps,
  contentProps,
  footerProps,
  children,
  ...rest
}: CardProps) => (
  <CardRoot {...rest}>
    {icon && icon}

    {(title || description) && (
      <CardHeader {...headerProps}>
        {title && <CardTitle {...titleProps}>{title}</CardTitle>}
        {description && (
          <CardDescription {...descriptionProps}>{description}</CardDescription>
        )}
      </CardHeader>
    )}

    <CardContent {...contentProps}>{children}</CardContent>

    {footer && <CardFooter {...footerProps}>{footer}</CardFooter>}
  </CardRoot>
);

export {
  Card,
  CardRoot,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  /** @knipignore */
  cardVariants,
  /** @knipignore */
  type CardProps,
};
