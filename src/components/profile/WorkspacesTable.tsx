import { Building2 } from "lucide-react";

import { Link } from "@/components/core";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Role } from "@/generated/graphql";
import capitalizeFirstLetter from "@/lib/util/capitalizeFirstLetter";
import { useOrganization } from "@/providers/OrganizationProvider";

interface WorkspaceNode {
  rowId: string;
  organizationId: string;
  tier: string;
  currentUser: {
    nodes: Array<{
      role: Role;
    }>;
  };
}

interface Props {
  workspaces: WorkspaceNode[] | undefined;
  onDeleteWorkspace: (workspace: {
    rowId: string;
    organizationId: string;
  }) => void;
}

const WorkspacesTable = ({ workspaces, onDeleteWorkspace }: Props) => {
  const orgContext = useOrganization();

  // Helper to resolve org details from JWT claims
  const getOrgDetails = (organizationId: string) =>
    orgContext?.getOrganizationById(organizationId);

  if (!workspaces?.length) {
    return (
      <div className="flex flex-col gap-2">
        <p>
          No current workspaces.{" "}
          <Link
            to="/pricing"
            variant="unstyled"
            className="p-0 text-md text-primary-600 underline"
          >
            Create a workspace
          </Link>{" "}
          to get started.
        </p>
      </div>
    );
  }

  return (
    <Table containerProps="rounded-md border">
      <TableHeader>
        <TableRow className="bg-muted hover:bg-muted">
          <TableHead className="pl-3 font-semibold">Workspace</TableHead>
          <TableHead className="font-semibold">Tier</TableHead>
          <TableHead className="font-semibold">Role</TableHead>
          <TableHead className="pr-3 text-right font-semibold">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {workspaces.map((workspace) => {
          const org = getOrgDetails(workspace.organizationId);
          const orgName = org?.name;
          const orgSlug = org?.slug;

          return (
            <TableRow key={workspace.rowId} className="hover:bg-background">
              <TableCell className="py-4 pl-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="size-4 text-primary" />
                  </div>
                  <span className="font-medium">{orgName}</span>
                </div>
              </TableCell>
              <TableCell className="py-4 pl-1">
                <Badge variant="outline">
                  {capitalizeFirstLetter(workspace.tier)}
                </Badge>
              </TableCell>
              <TableCell className="py-4 pl-1">
                <Badge>
                  {capitalizeFirstLetter(workspace.currentUser.nodes[0].role)}
                </Badge>
              </TableCell>
              <TableCell className="py-4 pr-3 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    to="/workspaces/$workspaceSlug/settings"
                    params={{ workspaceSlug: orgSlug! }}
                    variant="outline"
                    size="sm"
                    className="hover:border-green-200 hover:bg-green-50 hover:text-green-700 dark:hover:border-green-800 dark:hover:bg-green-950 dark:hover:text-green-300"
                  >
                    Settings
                  </Link>
                  {workspace.currentUser.nodes[0].role === Role.Owner ? (
                    <div className="justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:hover:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-300"
                        onClick={() => {
                          onDeleteWorkspace({
                            rowId: workspace.rowId,
                            organizationId: workspace.organizationId,
                          });
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <div className="justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:hover:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-300"
                        // TODO: add leave workspace functionality
                        disabled
                      >
                        Leave
                      </Button>
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default WorkspacesTable;
