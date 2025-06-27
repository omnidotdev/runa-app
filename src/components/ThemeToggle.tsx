import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/providers/ThemeProvider";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () =>
    theme === "dark" ? setTheme("light") : setTheme("dark");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-md hover:bg-base-100 dark:hover:bg-base-700"
      aria-label="Toggle theme"
    >
      <Moon className="hidden h-4 w-4 text-base-600 dark:block dark:text-base-300" />
      <Sun className="h-4 w-4 text-base-600 dark:hidden dark:text-base-300" />
    </button>
  );
};

export default ThemeToggle;
