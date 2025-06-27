import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  FolderOpen,
  LogOut,
  PanelLeftCloseIcon,
  PanelLeftIcon,
  Plus,
  Settings,
} from "lucide-react";
import { useState } from "react";

import CreateProjectDialog from "@/components/CreateProjectDialog";
import Link from "@/components/core/Link";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import WorkspaceSelector from "@/components/WorkspaceSelector";
import useDialogStore, { DialogType } from "@/lib/hooks/store/useDialogStore";
import workspaceOptions from "@/lib/options/workspace.options";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { workspaceId } = useParams({ strict: false });

  const { data: workspace } = useQuery({
    ...workspaceOptions(workspaceId!),
    enabled: !!workspaceId,
    select: (data) => data.workspace,
  });
  const navigate = useNavigate();

  const { setIsOpen: setIsCreateProjectOpen } = useDialogStore({
    type: DialogType.CreateProject,
  });

  const { setIsOpen: setIsCreateWorkspaceOpen } = useDialogStore({
    type: DialogType.CreateWorkspace,
  });

  return (
    // <div>
    //   <div
    //     className={cn(
    //       "grid h-full grid-rows-[auto_1fr_auto] border-r bg-background",
    //       isSidebarCollapsed && "absolute inset-0 w-24",
    //     )}
    //   >
    //     <div className="flex items-center justify-between gap-2 border-b p-4">
    //       <WorkspaceSelector />

    //       <ThemeToggle />
    //     </div>

    //     <div className="flex flex-col overflow-hidden p-4">
    //       {workspaceId && (
    //         <>
    // <Link
    //   to="/workspaces/$workspaceId/projects"
    // params={{
    //   workspaceId: workspaceId!,
    // }}
    // variant="ghost"
    // activeOptions={{ exact: true }}
    // activeProps={{
    //   variant: "outline",
    // }}
    // className="w-full justify-start"
    // >
    //   <div className="flex items-center gap-2">
    //     <FolderOpen className="text-base-500" />
    //     <span>Projects</span>
    //   </div>

    //   <Button
    //     variant="outline"
    //     size="icon"
    //     className="ml-auto size-6"
    //     onClick={(e) => {
    //       e.preventDefault();
    //       setIsCreateProjectOpen(true);
    //     }}
    //   >
    //     <Plus className="text-base-500" />
    //   </Button>
    // </Link>

    //           <div className="mt-2 flex h-full flex-col gap-1 overflow-y-auto">
    //             {workspace?.projects.nodes?.map((project) => (
    // <Link
    //   key={project?.rowId}
    //   to="/workspaces/$workspaceId/projects/$projectId"
    //   params={{
    //     workspaceId: workspaceId!,
    //     projectId: project?.rowId!,
    //   }}
    //   variant="ghost"
    //   size="sm"
    //   activeProps={{
    //     variant: "outline",
    //   }}
    //   className="justify-start"
    // >
    //   <span className="truncate">{project?.name}</span>
    // </Link>
    //             ))}
    //           </div>
    //         </>
    //       )}
    //     </div>

    // <div className="w-full p-4">
    //   <Button
    //     variant="outline"
    //     onClick={(e) => {
    //       e.preventDefault();
    //       setIsCreateWorkspaceOpen(true);
    //     }}
    //     className="w-full"
    //   >
    //     <div className="flex items-center gap-2">Workspaces</div>

    //     <Plus className="text-base-500" />
    //   </Button>
    // </div>

    //     <div className="grid items-end gap-2 border-t p-4">
    //       {workspaceId && (
    //         <Link
    //           to="/workspaces/$workspaceId/settings"
    //           params={{ workspaceId: workspaceId! }}
    //           variant="outline"
    //           className="w-full"
    //         >
    //           Workspace Settings
    //         </Link>
    //       )}

    //       <Button
    //         // TODO
    //         onClick={() => navigate({ to: "/" })}
    //         variant="outline"
    //         className="w-full text-red-600 dark:text-red-400"
    //       >
    //         <LogOut className="h-4 w-4" />
    //         Sign Out
    //       </Button>
    //     </div>
    //   </div>

    //   <Button
    //     variant="ghost"
    //     size="icon"
    //     onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
    //     className={cn(
    //       "absolute top-4 left-[224px] z-40 rounded-full border bg-muted p-1.5 shadow-md transition-none",
    //       isSidebarCollapsed && "left-3",
    //     )}
    //     title={isSidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
    //   >
    //     {isSidebarCollapsed ? (
    //       <PanelLeftIcon className="h-4 w-4 text-base-500 dark:text-base-400" />
    //     ) : (
    //       <PanelLeftCloseIcon className="h-4 w-4 text-base-500 dark:text-base-400" />
    //     )}
    //   </Button>

    //   <CreateProjectDialog />
    // </div>
    <>
      <div
        className={cn(
          "relative h-full transition-all",
          isSidebarCollapsed ? "w-fit" : "w-60",
        )}
      >
        <div className="grid h-full grid-rows-[auto_1fr_auto] border-r bg-background transition-all duration-200">
          {/* Header */}
          {!isSidebarCollapsed && (
            <div className="flex items-center justify-between gap-2 border-b p-4">
              <div className="flex-1">
                <WorkspaceSelector />
              </div>
              <ThemeToggle />
            </div>
          )}

          {/* Main content */}
          <div className="flex flex-col overflow-hidden p-2">
            {workspaceId && (
              <>
                <Link
                  to="/workspaces/$workspaceId/projects"
                  params={{
                    workspaceId: workspaceId!,
                  }}
                  variant="ghost"
                  size={isSidebarCollapsed ? "icon" : "md"}
                  activeOptions={{ exact: true }}
                  activeProps={{
                    variant: "outline",
                  }}
                  className={isSidebarCollapsed ? "mx-auto flex" : "w-full"}
                >
                  {isSidebarCollapsed ? (
                    <div className="mx-auto flex items-center justify-center">
                      <FolderOpen className="text-base-500" />
                    </div>
                  ) : (
                    <div className="flex w-full justify-start">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="text-base-500" />
                        <span>Projects</span>
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        className="ml-auto size-6"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsCreateProjectOpen(true);
                        }}
                      >
                        <Plus className="text-base-500" />
                      </Button>
                    </div>
                  )}
                </Link>

                {/* Project list */}
                {!isSidebarCollapsed && (
                  <div className="mt-2 flex h-full flex-col gap-1 overflow-y-auto">
                    {workspace?.projects.nodes?.map((project) => (
                      <Link
                        key={project?.rowId}
                        to="/workspaces/$workspaceId/projects/$projectId"
                        params={{
                          workspaceId: workspaceId!,
                          projectId: project?.rowId!,
                        }}
                        variant="ghost"
                        size="sm"
                        activeProps={{
                          variant: "outline",
                        }}
                        className="justify-start"
                      >
                        <span className="truncate">{project?.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="w-full p-4">
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                setIsCreateWorkspaceOpen(true);
              }}
              className={isSidebarCollapsed ? "" : "w-full"}
              size={isSidebarCollapsed ? "icon" : "md"}
            >
              {!isSidebarCollapsed && <span className="ml-2">Workspaces</span>}

              <Plus className="text-base-500" />
            </Button>
          </div>

          <div className="grid gap-2 border-t p-4">
            {workspaceId && (
              <Link
                to="/workspaces/$workspaceId/settings"
                params={{ workspaceId }}
                variant="outline"
                className={isSidebarCollapsed ? "" : "w-full text-left"}
                size={isSidebarCollapsed ? "icon" : "md"}
              >
                <Settings className="h-4 w-4" />

                {!isSidebarCollapsed && (
                  <span className="ml-2">Workspace Settings</span>
                )}
              </Link>
            )}

            <Button
              onClick={() => navigate({ to: "/" })}
              variant="outline"
              className={
                isSidebarCollapsed
                  ? "text-red-600 dark:text-red-400"
                  : "w-full text-red-600 dark:text-red-400"
              }
              size={isSidebarCollapsed ? "icon" : "md"}
            >
              <LogOut className="h-4 w-4" />

              {!isSidebarCollapsed && <span className="ml-2">Sign Out</span>}
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={cn(
            "absolute top-4 z-40 rounded-full border bg-muted p-1.5 shadow-md transition-all",
            isSidebarCollapsed ? "left-24" : "left-[224px]",
          )}
          title={isSidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
        >
          {isSidebarCollapsed ? (
            <PanelLeftIcon className="h-4 w-4 text-muted-foreground" />
          ) : (
            <PanelLeftCloseIcon className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
      <CreateProjectDialog />
    </>
  );
};

export default Sidebar;
