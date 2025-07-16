import { Moon, Sun } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";

import { Button } from "@/components/ui/button";
import { Hotkeys } from "@/lib/constants/hotkeys";
import { useTheme } from "@/lib/hooks/useTheme";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () =>
    theme === "dark" ? setTheme("light") : setTheme("dark");

  useHotkeys(Hotkeys.ToggleTheme, toggleTheme, [toggleTheme]);

  return (
    <Button onClick={toggleTheme} variant="ghost" aria-label="Toggle theme">
      <Moon className="hidden size-4 dark:block" />
      <Sun className="size-4 dark:hidden" />
    </Button>
  );
};

export default ThemeToggle;
