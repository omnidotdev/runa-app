import { gatekeeperOrgManageUrl } from "@omnidotdev/providers/react";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useParams } from "@tanstack/react-router";
import { ExternalLinkIcon } from "lucide-react";

import { Favicon } from "@/components/core";
import { buttonVariants } from "@/components/ui/button";
import { ACCOUNT_URL } from "@/lib/config/env.config";
import organizationBySlugOptions from "@/lib/options/organizationBySlug.options";
import getDomainLabel from "@/lib/util/getDomainLabel";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/providers/WorkspaceProvider";

/**
 * Workspace links (website, socials, etc.) are part of a workspace's shared
 * identity, owned by the Omni account hub (Gatekeeper) alongside its name and
 * logo, so they stay consistent across every Omni product. This surface shows
 * them and links out to the account hub to edit, rather than re-hosting the
 * editor.
 */
const WorkspaceLinks = () => {
  const { organizationId } = useLoaderData({
    from: "/_app/@{$workspaceSlug}/~/settings",
  });
  const { workspaceSlug } = useParams({
    from: "/_app/@{$workspaceSlug}/~/settings",
  });

  const orgContext = useWorkspace();

  const org = organizationId
    ? orgContext?.getWorkspaceById(organizationId)
    : undefined;

  // Prefer a live fetch so links edited in the account hub show without waiting
  // for the JWT claim to refresh; fall back to the claim while it loads.
  const { data: liveOrg } = useQuery(organizationBySlugOptions(workspaceSlug));
  const links = liveOrg?.links ?? org?.links ?? [];

  const manageUrl = ACCOUNT_URL
    ? gatekeeperOrgManageUrl(ACCOUNT_URL, workspaceSlug)
    : undefined;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="ml-2 font-medium text-base-700 text-sm lg:ml-0 dark:text-base-300">
        Links
      </h2>

      <p className="ml-2 max-w-prose text-base-500 text-sm lg:ml-0">
        Your workspace's website and social links are managed in your Omni
        account, so they stay consistent across every Omni product you use.
      </p>

      {links.length > 0 && (
        <div className="ml-2 flex flex-col divide-y border-y lg:ml-0">
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center gap-2 text-sm hover:text-foreground"
            >
              <Favicon url={link.url} />
              <span className="truncate">
                {link.title || getDomainLabel(link.url)}
              </span>
              <span className="truncate text-base-400 text-xs">{link.url}</span>
            </a>
          ))}
        </div>
      )}

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
          Manage links in Omni
          <ExternalLinkIcon className="size-4" />
        </a>
      )}
    </div>
  );
};

export default WorkspaceLinks;
