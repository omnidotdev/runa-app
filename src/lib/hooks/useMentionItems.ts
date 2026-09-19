import { useOrganization } from "@omnidotdev/providers/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useMemo } from "react";

import organizationMembersOptions from "@/lib/options/organizationMembers.options";

import type { MentionItem } from "@omnidotdev/thornberry/rich-text-editor";

/**
 * Mentionable workspace members for the rich-text editor `@`-typeahead.
 *
 * Sourced from the IDP org member list (the same data the assignee picker uses),
 * keyed by IDP user id. The organization is resolved from the URL workspace slug
 * (not the globally selected org) so mentions always list the members of the
 * workspace being viewed. Returns an empty list outside a workspace route (e.g.
 * public boards), which leaves the editor's mention typeahead disabled
 */
const useMentionItems = (): MentionItem[] => {
  const { workspaceSlug } = useParams({ strict: false });
  const orgContext = useOrganization();

  const organizationId = workspaceSlug
    ? orgContext?.organizations?.find((org) => org.slug === workspaceSlug)?.id
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
        })),
    [data],
  );
};

export default useMentionItems;
