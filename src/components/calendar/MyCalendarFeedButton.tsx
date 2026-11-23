import { Button } from "@omnidotdev/thornberry/button";
import { ConfirmDialog } from "@omnidotdev/thornberry/confirm-dialog";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@omnidotdev/thornberry/dialog";
import { CalendarPlusIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  useCreateMyCalendarFeedTokenMutation,
  useMyCalendarFeedQuery,
  useRevokeMyCalendarFeedTokenMutation,
} from "@/generated/graphql";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";

/**
 * "Subscribe" control for the My Calendar page. Creates a personal, read-only
 * iCalendar feed URL for the signed-in user's dated tasks across the workspace.
 * The feed URL carries a capability token and is shown exactly once on create
 * or regenerate (the API never returns it again); anyone with the link can see
 * the calendar, so it is treated as a secret.
 */
const MyCalendarFeedButton = ({
  organizationId,
}: {
  organizationId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // the feed URL surfaced once after create/regenerate; cleared on dialog close
  const [revealedUrl, setRevealedUrl] = useState<string | null>(null);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);

  const { data } = useMyCalendarFeedQuery({ organizationId });
  const enabled = !!data?.myCalendarFeed?.enabled;

  const invalidates = {
    meta: { invalidates: [getQueryKeyPrefix(useMyCalendarFeedQuery)] },
  };
  const onError = () => toast.error("Something went wrong. Please try again.");

  const { mutate: createFeed, isPending: isCreating } =
    useCreateMyCalendarFeedTokenMutation({
      ...invalidates,
      onError,
      onSuccess: (result) => {
        setConfirmRegenerate(false);
        const url = result.createMyCalendarFeedToken?.url;
        if (url) setRevealedUrl(url);
      },
    });

  const { mutate: revokeFeed, isPending: isRevoking } =
    useRevokeMyCalendarFeedTokenMutation({
      ...invalidates,
      onError,
      onSuccess: () => {
        setConfirmRevoke(false);
        toast.success("Calendar subscription removed.");
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
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <CalendarPlusIcon />
        Subscribe
      </Button>

      {/* status + create/regenerate (and the one-time URL reveal) */}
      <DialogRoot
        open={isOpen}
        onOpenChange={(details) => {
          setIsOpen(details.open);
          if (!details.open) setRevealedUrl(null);
        }}
      >
        <DialogPortal>
          <DialogBackdrop />
          <DialogPositioner>
            <DialogContent className="max-w-md">
              <DialogCloseTrigger />

              <div className="flex flex-col gap-4">
                <DialogTitle>Subscribe to your calendar</DialogTitle>
                <DialogDescription>
                  Add your due dates to any calendar app (Google, Apple,
                  Outlook) as a subscribed calendar that stays up to date. The
                  link is shown once; anyone with it can view your calendar.
                </DialogDescription>

                {revealedUrl && (
                  <code className="bg-base-100 dark:bg-base-800 block overflow-x-auto rounded-md border p-3 font-mono text-xs break-all">
                    {revealedUrl}
                  </code>
                )}
              </div>

              <div className="flex justify-end gap-2">
                {revealedUrl ? (
                  <>
                    <Button variant="outline" onClick={onCopyUrl}>
                      <CopyIcon />
                      Copy
                    </Button>
                    <Button onClick={() => setRevealedUrl(null)}>Done</Button>
                  </>
                ) : (
                  <>
                    {enabled && (
                      <Button
                        variant="outline"
                        onClick={() => setConfirmRevoke(true)}
                      >
                        Unsubscribe
                      </Button>
                    )}
                    <Button
                      disabled={isCreating}
                      // regenerating revokes the live URL, so confirm it first
                      onClick={() =>
                        enabled
                          ? setConfirmRegenerate(true)
                          : createFeed({ organizationId })
                      }
                    >
                      {enabled ? "Regenerate link" : "Create link"}
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </DialogPositioner>
        </DialogPortal>
      </DialogRoot>

      {/* destructive unsubscribe + regenerate confirmations */}
      <ConfirmDialog
        open={confirmRevoke}
        onOpenChange={setConfirmRevoke}
        title="Unsubscribe from your calendar feed?"
        description="The current feed URL will stop working immediately and any calendar subscribed to it will no longer update. This cannot be undone."
        confirmLabel="Unsubscribe"
        pendingLabel="Unsubscribing..."
        isPending={isRevoking}
        onConfirm={() => revokeFeed({ organizationId })}
      />
      <ConfirmDialog
        open={confirmRegenerate}
        onOpenChange={setConfirmRegenerate}
        title="Regenerate your calendar feed URL?"
        description="The current feed URL will stop working immediately, and any calendar subscribed to it will stop updating until you add the new link. This cannot be undone."
        confirmLabel="Regenerate"
        pendingLabel="Regenerating..."
        isPending={isCreating}
        onConfirm={() => createFeed({ organizationId })}
      />
    </>
  );
};

export default MyCalendarFeedButton;
