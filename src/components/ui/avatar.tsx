import { Avatar as ArkAvatar, useAvatar as useArkAvatar } from "@ark-ui/react";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps, ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";

const avatarVariants = tv({
  slots: {
    root: "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full",
    fallback:
      "flex size-full items-center justify-center rounded-full bg-muted",
    image: "aspect-square size-full",
  },
  variants: {
    size: {
      xs: {
        root: "size-8",
        fallback: "text-xs",
      },
      sm: {
        root: "size-9",
        fallback: "text-sm",
      },
      md: {
        root: "size-10",
        fallback: "text-md",
      },
      lg: {
        root: "size-11",
        fallback: "text-lg",
      },
      xl: {
        root: "size-12",
        fallback: "text-xl",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const { root, fallback: fallbackVariants, image } = avatarVariants();

const useAvatar = useArkAvatar;

const AvatarProvider = ({
  className,
  size,
  ...rest
}: ComponentProps<typeof ArkAvatar.RootProvider> &
  VariantProps<typeof root>) => (
  <ArkAvatar.RootProvider className={cn(root({ size }), className)} {...rest} />
);

const AvatarRoot = ({
  className,
  size,
  ...rest
}: ComponentProps<typeof ArkAvatar.Root> & VariantProps<typeof root>) => (
  <ArkAvatar.Root className={cn(root({ size }), className)} {...rest} />
);

const AvatarFallback = ({
  className,
  size,
  ...rest
}: ComponentProps<typeof ArkAvatar.Fallback> &
  VariantProps<typeof fallbackVariants>) => (
  <ArkAvatar.Fallback
    asChild={typeof rest.children !== "string"}
    className={cn(
      fallbackVariants({ size }),
      typeof rest.children !== "string" && "p-2",
      className,
    )}
    {...rest}
  />
);

const AvatarImage = ({
  className,
  size,
  ...rest
}: ComponentProps<typeof ArkAvatar.Image> & VariantProps<typeof image>) => (
  <ArkAvatar.Image
    className={cn(image({ size }), className)}
    alt="Avatar"
    {...rest}
  />
);

interface AvatarProps extends ComponentProps<typeof AvatarRoot> {
  // TODO: fix type issue upstream in thornberry
  src: string | undefined;
  alt: string | undefined;
  fallback: ReactNode;
}

const Avatar = ({
  src,
  alt,
  fallback,
  className,
  size,
  ...rest
}: AvatarProps) => (
  <AvatarRoot className={root({ size })} {...rest}>
    <AvatarFallback className={cn(fallbackVariants({ size }), className)}>
      {fallback}
    </AvatarFallback>

    <AvatarImage
      src={src}
      alt={alt}
      className={cn(image({ size }), className)}
    />
  </AvatarRoot>
);

export {
  Avatar,
  /** @knipignore */
  AvatarRoot,
  /** @knipignore */
  AvatarFallback,
  /** @knipignore */
  AvatarImage,
  /** @knipignore */
  AvatarProvider,
  /** @knipignore */
  useAvatar,
  /** @knipignore */
  avatarVariants,
  /** @knipignore */
  type AvatarProps,
};
