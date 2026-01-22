import { useHotkeys } from "react-hotkeys-hook";

import { Sidebar, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { Hotkeys } from "@/lib/constants/hotkeys";
import AppSidebarContent from "./AppSidebarContent";
import AppSidebarFooter from "./AppSidebarFooter";
import AppSidebarHeader from "./AppSidebarHeader";

import type { ComponentProps } from "react";

const AppSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
  // const { organizationId } = useLoaderData({ from: "/_auth" });
  // const { workspaceSlug } = useParams({ strict: false });
  // const navigate = useNavigate();
  // const orgContext = useOrganization();

  // // Resolve organization name from JWT claims
  // const orgName = organizationId
  //   ? orgContext?.getOrganizationById(organizationId)?.name
  //   : undefined;

  // const { mutate: deleteProject } = useDeleteProjectMutation({
  //   meta: {
  //     invalidates: [
  //       getQueryKeyPrefix(useProjectsQuery),
  //       getQueryKeyPrefix(useProjectColumnsQuery),
  //     ],
  //   },
  // });

  const { toggleSidebar } = useSidebar();

  useHotkeys(Hotkeys.ToggleSidebar, toggleSidebar, [toggleSidebar]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <AppSidebarHeader />

      <AppSidebarContent />

      <AppSidebarFooter />

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
