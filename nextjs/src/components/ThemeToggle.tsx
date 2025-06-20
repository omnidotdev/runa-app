"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () =>
    resolvedTheme === "dark" ? setTheme("light") : setTheme("dark");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
      aria-label="Toggle theme"
    >
      <Moon className="hidden h-5 w-5 text-gray-600 dark:block dark:text-gray-300" />
      <Sun className="h-5 w-5 text-gray-600 dark:hidden dark:text-gray-300" />
    </button>
  );
};

export default ThemeToggle;
