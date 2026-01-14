export interface FlagConfig {
  variants: Record<string, boolean | string | number>;
  defaultVariant: string;
}

export const defaultFlags: Record<string, FlagConfig> = {
  "runa-maintenance": {
    variants: {
      on: true,
      off: false,
    },
    defaultVariant: "off",
  },
};

export const FLAGS = {
  MAINTENANCE: "runa-maintenance",
} as const;
