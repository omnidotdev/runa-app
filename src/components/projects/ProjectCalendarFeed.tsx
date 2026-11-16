import { useLoaderData } from "@tanstack/react-router";
import { CalendarIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCalendarFeedQuery,
  useCreateCalendarFeedTokenMutation,
  useRevokeCalendarFeedTokenMutation,
} from "@/generated/graphql";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import { Role } from "@/lib/permissions";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";

/**
 * Calendar subscription feed for a project. Publishes the project's dated tasks
 * as a read-only iCalendar feed that calendar apps subscribe to by URL. The
 * feed URL carries a capability token and is shown exactly once on create or
 * regenerate (the API never returns it again); anyone with the link can view
 * the project's task calendar, so it is treated as a secret. Managing the feed
 * is admin-only, enforced server-side; the badge and disabled controls here are
 * UX only.
 */
const ProjectCalendarFeed = () => {
  const { projectId, organizationId } = useLoaderData({
    from: "/_app/@{$workspaceSlug}/$projectSlug/~/settings",
  });

  const role = useCurrentUserRole(organizationId);
  const isMember = role === Role.Member;

  // the feed URL surfaced once after create/regenerate; cleared on dialog close
  const [revealedUrl, setRevealedUrl] = useState<string | null>(null);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);

  const { data } = useCalendarFeedQuery({ projectId });
  const enabled = !!data?.calendarFeed?.enabled;

  const invalidates = {
    meta: { invalidates: [getQueryKeyPrefix(useCalendarFeedQuery)] },
  };

  // never leak server-side detail; log stays server-side
  const onError = () => {
    toast.error("Something went wrong. Please try again.");
  };

  const { mutate: createFeed, isPending: isCreating } =
    useCreateCalendarFeedTokenMutation({
      ...invalidates,
      onError,
      onSuccess: (result) => {
        setConfirmRegenerate(false);
        const url = result.createCalendarFeedToken?.url;
        if (url) setRevealedUrl(url);
      },
    });

  const { mutate: revokeFeed, isPending: isRevoking } =
    useRevokeCalendarFeedTokenMutation({
      ...invalidates,
      onError,
      onSuccess: () => {
        setConfirmRevoke(false);
        toast.success("Calendar feed revoked.");
      },
    });

  const onCopyUrl = async () => {
    if (!revealedUrl) return;
    try {
      await navigator.clipboard.writeText(revealedUrl);
      toast.success("Feed URL copied to clipboard.");
    } catch {
      toast.error("Could not copy. Select and copy it manually.");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-1 flex h-10 items-center justify-between">
        <h2 className="text-base-700 dark:text-base-300 ml-2 flex items-center gap-2 text-sm font-medium lg:ml-0">
          Calendar feed
          <span className="bg-base-100 text-base-500 dark:bg-base-800 rounded px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase">
            Admin only
          </span>
        </h2>
      </div>

      <p className="text-base-500 mb-3 ml-2 text-xs lg:ml-0">
        Subscribe to this project's due dates in your calendar app. The feed URL
        is shown once when you create it; anyone with the link can view the
        calendar, so keep it private and regenerate it if it leaks.
      </p>

      <div className="flex items-center justify-between border-y py-3 pl-2 lg:pl-0">
        <div className="flex items-center gap-3">
          <CalendarIcon className="text-base-500 size-4" />
          <span className="text-sm">
            {enabled
              ? "A feed URL is active for this project."
              : "No feed URL yet."}
          </span>
        </div>

        <div className="flex items-center gap-2 pr-2">
          {enabled && (
            <Button
              variant="outline"
              disabled={isMember}
              onClick={() => setConfirmRevoke(true)}
            >
              Revoke
            </Button>
          )}
          <Button
            variant={enabled ? "outline" : "solid"}
            disabled={isMember || isCreating}
            // regenerating revokes the live URL, so confirm it first
            onClick={() =>
              enabled ? setConfirmRegenerate(true) : createFeed({ projectId })
            }
          >
            {enabled ? "Regenerate" : "Create feed URL"}
          </Button>
        </div>
      </div>

      {/* one-time feed URL reveal */}
      <DialogRoot
        open={!!revealedUrl}
        onOpenChange={(details) => {
          if (!details.open) setRevealedUrl(null);
        }}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent className="bg-background w-full max-w-md rounded-lg">
            <DialogCloseTrigger />

            <div className="mb-4 flex flex-col gap-4">
              <DialogTitle>Calendar feed URL</DialogTitle>
              <DialogDescription>
                Copy this now. For your security it will not be shown again. Add
                it as a subscribed calendar in your calendar app. Anyone with
                this link can view the project's task calendar.
              </DialogDescription>

              <code className="bg-base-100 dark:bg-base-800 block overflow-x-auto rounded-md border p-3 font-mono text-xs break-all">
                {revealedUrl}
              </code>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onCopyUrl}>
                <CopyIcon />
                Copy
              </Button>
              <Button onClick={() => setRevealedUrl(null)}>Done</Button>
            </div>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>

      {/* destructive revoke + regenerate confirmations */}
      <ConfirmDialog
        open={confirmRevoke}
        onOpenChange={setConfirmRevoke}
        title="Revoke calendar feed?"
        description="The current feed URL will stop working immediately and any calendar subscribed to it will no longer update. This cannot be undone."
        confirmLabel="Revoke"
        isPending={isRevoking}
        onConfirm={() => revokeFeed({ projectId })}
      />
      <ConfirmDialog
        open={confirmRegenerate}
        onOpenChange={setConfirmRegenerate}
        title="Regenerate calendar feed URL?"
        description="The current feed URL will stop working immediately, and any calendar subscribed to it will stop updating until you add the new link. This cannot be undone."
        confirmLabel="Regenerate"
        isPending={isCreating}
        onConfirm={() => createFeed({ projectId })}
      />
    </div>
  );
};

export default ProjectCalendarFeed;
