import { Button } from "@omnidotdev/thornberry/button";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/providers/ThemeProvider";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () =>
    theme === "dark" ? setTheme("light") : setTheme("dark");

  return (
    <Button onClick={toggleTheme} variant="ghost" aria-label="Toggle theme">
      <Moon className="hidden size-4 dark:block" />
      <Sun className="size-4 dark:hidden" />
    </Button>
  );
};

export default ThemeToggle;
