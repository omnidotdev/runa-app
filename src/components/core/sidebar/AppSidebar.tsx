import { useQuery } from "@tanstack/react-query";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useRouteContext,
} from "@tanstack/react-router";
import { useState } from "react";

import DestructiveActionDialog from "@/components/core/DestructiveActionDialog";
import AppSidebarContent from "@/components/core/sidebar/AppSidebarContent";
import AppSidebarFooter from "@/components/core/sidebar/AppSidebarFooter";
import AppSidebarHeader from "@/components/core/sidebar/AppSidebarHeader";
import { Sidebar, SidebarRail } from "@/components/ui/sidebar";
import { useDeleteProjectMutation } from "@/generated/graphql";
import { DialogType } from "@/lib/hooks/store/useDialogStore";
import projectColumnsOptions from "@/lib/options/projectColumns.options";
import workspaceOptions from "@/lib/options/workspace.options";

import type { ComponentProps } from "react";

const AppSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
  const { workspaceId } = useLoaderData({ from: "/_auth" });
  const { session } = useRouteContext({ strict: false });
  const { workspaceSlug } = useParams({ strict: false });
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<{
    rowId: string;
    name: string;
  }>();

  const { data: workspace } = useQuery({
    ...workspaceOptions({
      rowId: workspaceId!,
      userId: session?.user?.rowId!,
    }),
    enabled: !!workspaceId,
    select: (data) => data.workspace,
  });

  const { mutate: deleteProject } = useDeleteProjectMutation({
    meta: {
      invalidates: [
        ["Projects"],
        workspaceOptions({
          rowId: workspaceId!,
          userId: session?.user?.rowId!,
        }).queryKey,
        projectColumnsOptions({ workspaceId: workspaceId! }).queryKey,
      ],
    },
  });

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <AppSidebarHeader />

        <AppSidebarContent
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />

        <AppSidebarFooter />

        <SidebarRail />
      </Sidebar>

      {/* Delete Project */}
      <DestructiveActionDialog
        title="Danger Zone"
        description={`This will delete the project "${selectedProject?.name}" from ${workspace?.name} workspace. This action cannot be undone.`}
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
