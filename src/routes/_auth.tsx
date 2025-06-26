import { Outlet } from "@tanstack/react-router";
import { PanelLeftCloseIcon, PanelLeftIcon } from "lucide-react";
import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-dvh w-full">
      <div
        className={cn(
          "relative w-60 flex-shrink-0",
          isSidebarCollapsed && "w-0",
        )}
      >
        <div
          className={cn(
            "absolute inset-0",
            isSidebarCollapsed && "pointer-events-none opacity-0",
          )}
        >
          <Sidebar />
        </div>
      </div>

      <Button
        size="icon"
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className={cn(
          "-translate-y-1/2 absolute top-1/2 left-[224px] z-40 rounded-full border border-base-200 bg-white p-1.5 shadow-md transition-none hover:bg-base-100 dark:border-base-700 dark:bg-base-800 dark:hover:bg-base-700",
          isSidebarCollapsed && "left-3",
        )}
        title={isSidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
      >
        {isSidebarCollapsed ? (
          <PanelLeftIcon className="h-4 w-4 text-base-500 dark:text-base-400" />
        ) : (
          <PanelLeftCloseIcon className="h-4 w-4 text-base-500 dark:text-base-400" />
        )}
      </Button>

      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
