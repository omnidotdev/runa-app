import { gatekeeperOrgManageUrl } from "@omnidotdev/providers/react";
import { useParams } from "@tanstack/react-router";
import { ExternalLinkIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { ACCOUNT_URL } from "@/lib/config/env.config";
import { cn } from "@/lib/utils";

/**
 * Team members and org roles are managed centrally in the Omni account hub
 * (Gatekeeper), the single source of truth shared across every product, so
 * this surface links out instead of re-hosting member management.
 */
const WorkspaceMembers = () => {
  const { workspaceSlug } = useParams({
    from: "/_app/@{$workspaceSlug}/~/settings",
  });

  const manageUrl = ACCOUNT_URL
    ? gatekeeperOrgManageUrl(ACCOUNT_URL, workspaceSlug)
    : undefined;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="ml-2 font-medium text-base-700 text-sm lg:ml-0 dark:text-base-300">
        Team Members
      </h2>

      <p className="ml-2 max-w-prose text-base-500 text-sm lg:ml-0">
        Team members and roles are managed in your Omni account, so they stay
        consistent across every Omni product you use.
      </p>

      {manageUrl && (
        <a
          href={manageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "solid", size: "sm" }),
            "ml-2 w-fit gap-1.5 lg:ml-0",
          )}
        >
          Manage members in Omni
          <ExternalLinkIcon className="size-4" />
        </a>
      )}
    </div>
  );
};

export default WorkspaceMembers;
