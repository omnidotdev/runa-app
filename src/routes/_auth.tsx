import { Outlet } from "@tanstack/react-router";
import { PanelLeftCloseIcon, PanelLeftIcon } from "lucide-react";
import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-dvh w-full">
      <div
        className={`relative flex-shrink-0 ${isSidebarCollapsed ? "w-0" : "w-60"}`}
      >
        <div
          className={`absolute inset-0 ${isSidebarCollapsed ? "pointer-events-none opacity-0" : "opacity-100"}`}
        >
          <Sidebar />
        </div>
      </div>

      <Button
        size="icon"
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className={`-translate-y-1/2 absolute top-1/2 z-40 rounded-full border border-base-200 bg-white p-1.5 shadow-md hover:bg-base-100 dark:border-base-700 dark:bg-base-800 dark:hover:bg-base-700 ${
          isSidebarCollapsed ? "left-3" : "left-[224px]"
        }`}
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
