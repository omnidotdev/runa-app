import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useMemo } from "react";

import organizationMembersOptions from "@/lib/options/organizationMembers.options";
import { useWorkspace } from "@/providers/WorkspaceProvider";

import type { MentionItem } from "@omnidotdev/thornberry/rich-text-editor";

/**
 * Mentionable workspace members for the rich-text editor `@`-typeahead.
 *
 * Sourced from the IDP org member list (the same data the assignee picker uses),
 * keyed by IDP user id. Each mention links to `#mention-<idpUserId>`, which the
 * API parses to send mention emails. The organization is resolved from the URL workspace slug
 * (not the globally selected org) so mentions always list the members of the
 * workspace being viewed. Returns an empty list outside a workspace route (e.g.
 * public boards), which leaves the editor's mention typeahead disabled
 */
const useMentionItems = (): MentionItem[] => {
  const { workspaceSlug } = useParams({ strict: false });
  const orgContext = useWorkspace();

  const organizationId = workspaceSlug
    ? orgContext?.workspaces?.find((org) => org.slug === workspaceSlug)?.id
    : undefined;

  const { data } = useQuery({
    ...organizationMembersOptions({ organizationId: organizationId ?? "" }),
    enabled: !!organizationId,
  });

  return useMemo(
    () =>
      (data?.data ?? [])
        .filter((member) => member.user?.name)
        .map((member) => ({
          id: member.userId,
          label: member.user.name,
          // carries the mentioned user's IDP id so the API can email them; a
          // fragment href keeps a click inert in the read-only renderers
          url: `#mention-${member.userId}`,
        })),
    [data],
  );
};

export default useMentionItems;
