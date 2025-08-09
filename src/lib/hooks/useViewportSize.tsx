import { useMediaQuery } from "usehooks-ts";

/**
 * Enum representing standard breakpoints for responsive design
 */
export enum Breakpoint {
  /** Small devices - 40rem (640px) */
  Small = "40rem",
  /** Medium devices - 48rem (768px) */
  Medium = "48rem",
  /** Large devices - 64rem (1024px) */
  Large = "64rem",
  /** Extra large devices - 80rem (1280px) */
  XLarge = "80rem",
  /** 2x Extra large devices - 96rem (1536px) */
  "2XLarge" = "96rem",
}

/**
 * Options for useViewportSize hook
 */
interface Options {
  /** Breakpoint to check against the current viewport width */
  breakpoint: Breakpoint;
}

/**
 * Hook that determines if the current viewport width is at least the specified breakpoint
 *
 * @param options - Object containing the breakpoint to check against
 * @returns Boolean indicating if viewport width is at least the specified breakpoint
 */
const useViewportSize = ({ breakpoint }: Options) =>
  useMediaQuery(`(min-width: ${breakpoint})`);

export default useViewportSize;
