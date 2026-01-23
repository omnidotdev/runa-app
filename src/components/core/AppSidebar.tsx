import { useLoaderData, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Sidebar, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import {
  useDeleteProjectMutation,
  useProjectColumnsQuery,
  useProjectsQuery,
  useProjectsSidebarQuery,
} from "@/generated/graphql";
import { Hotkeys } from "@/lib/constants/hotkeys";
import { DialogType } from "@/lib/hooks/store/useDialogStore";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { useOrganization } from "@/providers/OrganizationProvider";
import AppSidebarContent from "./AppSidebarContent";
import AppSidebarFooter from "./AppSidebarFooter";
import AppSidebarHeader from "./AppSidebarHeader";
import DestructiveActionDialog from "./DestructiveActionDialog";

import type { ComponentProps } from "react";

const AppSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
  const { organizationId } = useLoaderData({ from: "/_auth" });
  const { workspaceSlug } = useParams({ strict: false });
  const navigate = useNavigate();
  const orgContext = useOrganization();
  const [selectedProject, setSelectedProject] = useState<{
    rowId: string;
    name: string;
  }>();

  // Resolve organization name from JWT claims
  const orgName = organizationId
    ? orgContext?.getOrganizationById(organizationId)?.name
    : undefined;

  const { mutate: deleteProject } = useDeleteProjectMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useProjectsQuery),
        getQueryKeyPrefix(useProjectColumnsQuery),
        getQueryKeyPrefix(useProjectsSidebarQuery),
      ],
    },
  });

  const { toggleSidebar } = useSidebar();

  useHotkeys(Hotkeys.ToggleSidebar, toggleSidebar, [toggleSidebar]);

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <AppSidebarHeader />

        <AppSidebarContent setSelectedProject={setSelectedProject} />

        <AppSidebarFooter />

        <SidebarRail />
      </Sidebar>

      {/* Delete Project */}
      <DestructiveActionDialog
        title="Danger Zone"
        description={`This will delete the project "${selectedProject?.name}" from ${orgName} workspace. This action cannot be undone.`}
        onConfirm={() => {
          deleteProject({ rowId: selectedProject?.rowId! });
          navigate({
            to: "/workspaces/$workspaceSlug/projects",
            params: { workspaceSlug: workspaceSlug! },
          });
        }}
        dialogType={DialogType.DeleteProject}
        confirmation={`permanently delete ${selectedProject?.name}`}
      />
    </>
  );
};

export default AppSidebar;
