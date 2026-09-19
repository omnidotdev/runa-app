import { useOrganization } from "@omnidotdev/providers/react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import organizationMembersOptions from "@/lib/options/organizationMembers.options";

import type { MentionItem } from "@omnidotdev/thornberry/rich-text-editor";

/**
 * Mentionable workspace members for the rich-text editor `@`-typeahead.
 *
 * Sourced from the IDP org member list (the same data the assignee picker uses),
 * keyed by IDP user id. Returns an empty list outside an organization context
 * (e.g. public boards) where the org provider is absent, which leaves the
 * editor's mention typeahead disabled
 */
const useMentionItems = (): MentionItem[] => {
  const orgContext = useOrganization();
  const organizationId = orgContext?.currentOrganization?.id;

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
