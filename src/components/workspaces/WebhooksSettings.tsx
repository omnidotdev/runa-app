import { useRouteContext } from "@tanstack/react-router";
import { CopyIcon, RefreshCwIcon, Trash2Icon, WebhookIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  useCreateWebhookEndpointMutation,
  useDeleteWebhookEndpointMutation,
  useRotateWebhookEndpointSecretMutation,
  useSetWebhookEndpointEnabledMutation,
  useWebhookEndpointsQuery,
} from "@/generated/graphql";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";

import type { FormEvent } from "react";

/**
 * Outgoing webhook endpoints for the workspace.
 *
 * Each endpoint receives a signed POST when workspace resources change. The
 * signing secret is returned only at create/rotate time and is shown to the
 * admin exactly once (the API never exposes it again). Managing endpoints is
 * admin-only and enforced server-side; the badge here is UX, not the gate
 */
const WebhooksSettings = () => {
  const { organizationId } = useRouteContext({
    from: "/_app/@{$workspaceSlug}/~/settings",
  });

  const [url, setUrl] = useState("");
  // the plaintext secret surfaced once after a create or rotate; kept only in
  // local state and cleared when the reveal dialog closes
  const [revealedSecret, setRevealedSecret] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    url: string;
  } | null>(null);

  const { data } = useWebhookEndpointsQuery(
    { organizationId: organizationId! },
    { enabled: !!organizationId },
  );

  const endpoints = data?.webhookEndpoints ?? [];

  const invalidates = {
    meta: { invalidates: [getQueryKeyPrefix(useWebhookEndpointsQuery)] },
  };

  // never surface server-side detail (e.g. SSRF rejection reasons); log stays
  // server-side, the user gets a generic, actionable message
  const onError = () => {
    toast.error("Something went wrong. Please try again.");
  };

  const { mutate: createEndpoint, isPending: isCreating } =
    useCreateWebhookEndpointMutation({
      ...invalidates,
      onError,
      onSuccess: (result) => {
        const secret = result.createWebhookEndpoint?.secret;
        setUrl("");
        if (secret) setRevealedSecret(secret);
      },
    });

  const { mutate: rotateSecret } = useRotateWebhookEndpointSecretMutation({
    ...invalidates,
    onError,
    onSuccess: (result) => {
      const secret = result.rotateWebhookEndpointSecret?.secret;
      if (secret) setRevealedSecret(secret);
    },
  });

  const { mutate: setEnabled } = useSetWebhookEndpointEnabledMutation({
    ...invalidates,
    onError,
  });

  const { mutate: deleteEndpoint } = useDeleteWebhookEndpointMutation({
    ...invalidates,
    onError,
    onSuccess: () => setDeleteTarget(null),
  });

  const onAdd = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = url.trim();
    if (!organizationId || !trimmed) return;
    createEndpoint({ organizationId, url: trimmed, eventTypes: null });
  };

  const onCopySecret = async () => {
    if (!revealedSecret) return;
    try {
      await navigator.clipboard.writeText(revealedSecret);
      toast.success("Secret copied to clipboard.");
    } catch {
      toast.error("Could not copy. Select and copy it manually.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="ml-2 flex items-center gap-2 font-medium text-base-700 text-sm lg:ml-0 dark:text-base-300">
        Webhooks
        <span className="rounded bg-base-100 px-1.5 py-0.5 font-medium text-[10px] text-base-500 uppercase tracking-wide dark:bg-base-800">
          Admin only
        </span>
      </h2>

      <p className="ml-2 text-base-500 text-xs lg:ml-0">
        Send a signed POST to your service when tasks and projects change. The
        signing secret is shown once when you add or rotate an endpoint.
      </p>

      <form onSubmit={onAdd} className="flex items-center gap-2 px-2 lg:px-0">
        <Input
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://your-service.com/webhooks"
          className="flex-1"
        />
        <Button type="submit" disabled={isCreating || !url.trim()}>
          Add endpoint
        </Button>
      </form>

      <div className="flex flex-col divide-y border-y">
        {endpoints.length === 0 ? (
          <div className="flex h-10 w-full items-center pl-2 text-base-500 text-sm lg:pl-0">
            No endpoints yet.
          </div>
        ) : (
          endpoints.map((endpoint) => (
            <div
              key={endpoint.id}
              className="flex h-10 w-full items-center justify-between gap-2"
            >
              <div className="flex min-w-0 items-center gap-3 pl-2 lg:pl-0">
                <WebhookIcon className="size-4 shrink-0 text-base-500" />
                <span className="truncate text-sm" title={endpoint.url ?? ""}>
                  {endpoint.url}
                </span>
              </div>

              <div className="flex items-center gap-2 pr-2">
                <Switch
                  checked={!!endpoint.enabled}
                  onCheckedChange={(checked) =>
                    endpoint.id &&
                    setEnabled({ id: endpoint.id, enabled: checked })
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Rotate signing secret"
                  onClick={() =>
                    endpoint.id && rotateSecret({ id: endpoint.id })
                  }
                >
                  <RefreshCwIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete endpoint"
                  onClick={() =>
                    endpoint.id &&
                    setDeleteTarget({
                      id: endpoint.id,
                      url: endpoint.url ?? "",
                    })
                  }
                >
                  <Trash2Icon />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* one-time secret reveal */}
      <DialogRoot
        open={!!revealedSecret}
        onOpenChange={(details) => {
          if (!details.open) setRevealedSecret(null);
        }}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent className="w-full max-w-md rounded-lg bg-background">
            <DialogCloseTrigger />

            <div className="mb-4 flex flex-col gap-4">
              <DialogTitle>Signing secret</DialogTitle>
              <DialogDescription>
                Copy this now. For your security it will not be shown again. Use
                it to verify the signature on incoming webhook requests.
              </DialogDescription>

              <code className="block overflow-x-auto break-all rounded-md border bg-base-100 p-3 font-mono text-xs dark:bg-base-800">
                {revealedSecret}
              </code>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onCopySecret}>
                <CopyIcon />
                Copy
              </Button>
              <Button onClick={() => setRevealedSecret(null)}>Done</Button>
            </div>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>

      {/* destructive delete confirmation */}
      <DialogRoot
        open={!!deleteTarget}
        onOpenChange={(details) => {
          if (!details.open) setDeleteTarget(null);
        }}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent className="w-full max-w-md rounded-lg bg-background">
            <DialogCloseTrigger />

            <div className="mb-4 flex flex-col gap-4">
              <DialogTitle>Delete webhook endpoint?</DialogTitle>
              <DialogDescription>
                This will stop delivering events to{" "}
                <span className="font-medium">{deleteTarget?.url}</span>. This
                action cannot be undone.
              </DialogDescription>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  deleteTarget && deleteEndpoint({ id: deleteTarget.id })
                }
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </div>
  );
};

export default WebhooksSettings;
