import { Building2, ChevronDown, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { useOrganization } from "@/providers/OrganizationProvider";

/**
 * Organization switcher component.
 * Only renders when user has multiple organizations.
 * Safe to use outside OrganizationProvider (renders nothing).
 */
const OrganizationSwitcher = () => {
  const orgContext = useOrganization();

  // Not in auth context or no organizations
  if (!orgContext) return null;

  const {
    organizations,
    currentOrganization,
    setCurrentOrganization,
    hasMultipleOrgs,
  } = orgContext;

  // Only show switcher when user has multiple orgs
  if (!hasMultipleOrgs) return null;

  return (
    <MenuRoot
      onSelect={(details) => {
        const orgId = details.value;
        if (orgId) setCurrentOrganization(orgId);
      }}
    >
      <MenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          {currentOrganization.type === "personal" ? (
            <User className="size-4" />
          ) : (
            <Building2 className="size-4" />
          )}
          {currentOrganization.slug}
          <ChevronDown className="size-4" />
        </Button>
      </MenuTrigger>

      <MenuPositioner>
        <MenuContent>
          <MenuItemGroup>
            {organizations.map((org) => (
              <MenuItem
                key={org.id}
                value={org.id}
                disabled={org.id === currentOrganization.id}
                className="gap-2"
              >
                {org.type === "personal" ? (
                  <User className="size-4" />
                ) : (
                  <Building2 className="size-4" />
                )}
                {org.slug}
                {org.type === "personal" && " (Personal)"}
              </MenuItem>
            ))}
          </MenuItemGroup>
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  );
};

export default OrganizationSwitcher;
