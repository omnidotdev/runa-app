export {
  OrganizationProvider as WorkspaceProvider,
  useOrganization as useWorkspace,
} from "@omnidotdev/providers/react";

// Default export for backward compatibility with existing default imports
import { OrganizationProvider } from "@omnidotdev/providers/react";

export default OrganizationProvider;
