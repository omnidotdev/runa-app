import { useRouter } from "@tanstack/react-router";
import { createContext, use } from "react";

import { setThemeServerFn } from "@/lib/server/theme";

import type { PropsWithChildren } from "react";

export type Theme = "light" | "dark";

type ThemeContextVal = { theme: Theme; setTheme: (theme: Theme) => void };
type Props = PropsWithChildren<{ theme: Theme }>;

const ThemeContext = createContext<ThemeContextVal | null>(null);

export const ThemeProvider = ({ children, theme }: Props) => {
  const router = useRouter();

  const setTheme = (theme: Theme) => {
    setThemeServerFn({ data: theme });
    router.invalidate();
  };

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
};

export const useTheme = () => {
  const val = use(ThemeContext);
  if (!val) throw new Error("useTheme called outside of ThemeProvider!");
  return val;
};
