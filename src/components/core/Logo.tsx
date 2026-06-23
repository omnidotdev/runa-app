import { useId } from "react";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

/**
 * Runa gear-moon logomark.
 *
 * Portable inline SVG (no raster or font dependency) that inherits the current
 * text color via `fill="currentColor"`, so callers theme it with text-color
 * utilities (e.g. `text-primary-500` for brand amber). The mask id is unique
 * per instance so several marks can render on the same page without colliding.
 */
const Logo = ({ className, ...props }: ComponentProps<"svg">) => {
  const maskId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      role="img"
      aria-label="Runa"
      className={cn("size-5", className)}
      {...props}
    >
      <defs>
        <mask id={maskId}>
          <rect width="512" height="512" fill="white" />
          <circle cx="348" cy="216" r="186" fill="black" />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <circle cx="256" cy="256" r="196" />
      </g>
      <path d="M 340.94 432.64 L 344.51 472.62 L 311.72 483.27 L 291.11 448.83 Z" />
      <path d="M 261.75 451.92 L 248.75 489.89 L 214.47 486.28 L 209.65 446.44 Z" />
      <path d="M 181.56 437.32 L 154.24 466.72 L 124.39 449.48 L 136.19 411.12 Z" />
      <path d="M 114.25 391.36 L 77.34 407.11 L 57.07 379.22 L 83.46 348.98 Z" />
      <path d="M 71.45 322.01 L 31.32 321.38 L 24.15 287.66 L 60.56 270.76 Z" />
      <path d="M 60.56 241.24 L 24.15 224.34 L 31.32 190.62 L 71.45 189.99 Z" />
      <path d="M 83.46 163.02 L 57.07 132.78 L 77.34 104.89 L 114.25 120.64 Z" />
      <path d="M 136.19 100.88 L 124.39 62.52 L 154.24 45.28 L 181.56 74.68 Z" />
    </svg>
  );
};

export default Logo;
