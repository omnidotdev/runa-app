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
      className="rounded-md p-2 hover:bg-base-100 dark:hover:bg-base-700"
      aria-label="Toggle theme"
    >
      <Moon className="hidden h-5 w-5 text-base-600 dark:block dark:text-base-300" />
      <Sun className="h-5 w-5 text-base-600 dark:hidden dark:text-base-300" />
    </button>
  );
};

export default ThemeToggle;
