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
import { AUTH_BASE_URL } from "@/lib/config/env.config";
import { Role } from "@/lib/permissions";
import capitalizeFirstLetter from "@/lib/util/capitalizeFirstLetter";

import type { OrganizationClaim } from "@/lib/auth/getAuth";

interface Props {
  organizations: OrganizationClaim[];
}

const WorkspacesTable = ({ organizations }: Props) => {
  // Helper to get user's role for an organization from JWT claims
  const getUserRole = (org: OrganizationClaim): Role => {
    if (org.roles.includes("owner")) return Role.Owner;
    if (org.roles.includes("admin")) return Role.Admin;
    return Role.Member;
  };

  if (!organizations?.length) {
    return (
      <div className="flex flex-col gap-2">
        <p>
          No current workspaces.{" "}
          <a
            href={`${AUTH_BASE_URL}/profile`}
            className="p-0 text-md text-primary-600 underline"
          >
            Create a workspace
          </a>{" "}
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
          <TableHead className="font-semibold">Role</TableHead>
          <TableHead className="pr-3 text-right font-semibold">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {organizations.map((org) => {
          const userRole = getUserRole(org);

          return (
            <TableRow key={org.id} className="hover:bg-background">
              <TableCell className="py-4 pl-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="size-4 text-primary" />
                  </div>
                  <span className="font-medium">{org.name}</span>
                </div>
              </TableCell>
              <TableCell className="py-4 pl-1">
                <Badge>{capitalizeFirstLetter(userRole)}</Badge>
              </TableCell>
              <TableCell className="py-4 pr-3 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    to="/workspaces/$workspaceSlug/settings"
                    params={{ workspaceSlug: org.slug! }}
                    variant="outline"
                    size="sm"
                    className="hover:border-green-200 hover:bg-green-50 hover:text-green-700 dark:hover:border-green-800 dark:hover:bg-green-950 dark:hover:text-green-300"
                  >
                    Settings
                  </Link>
                  {userRole === Role.Owner ? (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:hover:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-300"
                    >
                      <a href={`${AUTH_BASE_URL}/profile`}>Manage</a>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:hover:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-300"
                    >
                      <a href={`${AUTH_BASE_URL}/profile`}>Leave</a>
                    </Button>
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
