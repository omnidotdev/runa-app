import { useRouter } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { setCookie } from "@tanstack/react-start/server";
import { createContext, use } from "react";

import type { PropsWithChildren } from "react";

export type Theme = "light" | "dark";

const setThemeServerFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (data !== "dark" && data !== "light") {
      throw new Error("Invalid theme provided");
    }
    return data as Theme;
  })
  .handler(async ({ data }) => {
    setCookie("ui-theme", data);
  });

type ThemeContextVal = { theme: Theme; setTheme: (theme: Theme) => void };
type Props = PropsWithChildren<{ theme: Theme }>;

const ThemeContext = createContext<ThemeContextVal | null>(null);

export const ThemeProvider = ({ children, theme }: Props) => {
  const router = useRouter();
  const setThemeCookie = useServerFn(setThemeServerFn);

  const setTheme = (theme: Theme) => {
    setThemeCookie({ data: theme });
    // TODO: figure out why this doesn't always invalidate. Seems that you need to toggle twice each time even though the server function is indeed called each time
    router.invalidate();
  };

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
};

export const useTheme = () => {
  const val = use(ThemeContext);
  if (!val) throw new Error("useTheme called outside of ThemeProvider!");
  return val;
};
