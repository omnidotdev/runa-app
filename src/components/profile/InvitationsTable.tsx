import { Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrganization } from "@/providers/OrganizationProvider";

interface InvitationNode {
  rowId: string;
  workspace?: {
    rowId: string;
    organizationId: string;
    members: {
      totalCount: number;
    };
    projects: {
      nodes: Array<{
        rowId: string;
      }>;
    };
  } | null;
}

interface Props {
  invitations: InvitationNode[];
  onAccept: (invitation: InvitationNode) => void;
  onReject: (invitation: InvitationNode) => void;
}

const InvitationsTable = ({ invitations, onAccept, onReject }: Props) => {
  const orgContext = useOrganization();

  // Helper to resolve org details from JWT claims
  const getOrgDetails = (organizationId: string | undefined) =>
    organizationId
      ? orgContext?.getOrganizationById(organizationId)
      : undefined;

  if (!invitations.length) {
    return <p>No current invitations</p>;
  }

  return (
    <Table containerProps="rounded-md border">
      <TableHeader>
        <TableRow className="bg-muted hover:bg-muted">
          <TableHead className="pl-3 font-semibold">Workspace</TableHead>
          <TableHead className="font-semibold">Members</TableHead>
          <TableHead className="pr-3 text-right font-semibold">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => {
          const org = getOrgDetails(invitation.workspace?.organizationId);
          const orgName = org?.name;

          return (
            <TableRow key={invitation.rowId} className="hover:bg-background">
              <TableCell className="py-4 pl-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="size-4 text-primary" />
                  </div>
                  <span className="font-medium">{orgName}</span>
                </div>
              </TableCell>
              <TableCell className="py-4 pl-1">
                <span className="text-muted-foreground text-sm">
                  {invitation.workspace?.members.totalCount ?? 0} member
                  {invitation.workspace?.members.totalCount === 1 ? "" : "s"}
                </span>
              </TableCell>
              <TableCell className="py-4 pr-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:border-green-200 hover:bg-green-50 hover:text-green-700 dark:hover:border-green-800 dark:hover:bg-green-950 dark:hover:text-green-300"
                    onClick={() => onAccept(invitation)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:hover:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-300"
                    onClick={() => onReject(invitation)}
                  >
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default InvitationsTable;
