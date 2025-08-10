import { useRouter } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { setCookie } from "@tanstack/react-start/server";
import { createContext, use, useState } from "react";

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
  const [currentTheme, setCurrentTheme] = useState(theme);

  const router = useRouter();
  const setThemeCookie = useServerFn(setThemeServerFn);

  const setTheme = (theme: Theme) => {
    setThemeCookie({ data: theme });

    theme === "dark" ? setCurrentTheme("dark") : setCurrentTheme("light");

    router.invalidate();
  };

  return (
    <ThemeContext value={{ theme: currentTheme, setTheme }}>
      {children}
    </ThemeContext>
  );
};

export const useTheme = () => {
  const contextValue = use(ThemeContext);

  if (!contextValue)
    throw new Error("useTheme must be used within a <ThemeProvider />");

  return contextValue;
};
