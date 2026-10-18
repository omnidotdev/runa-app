import { useRouteContext } from "@tanstack/react-router";
import { KeyIcon, Trash2Icon } from "lucide-react";
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
import {
  useApiTokensQuery,
  useCreateApiTokenMutation,
  useRevokeApiTokenMutation,
} from "@/generated/graphql";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";

import type { FormEvent } from "react";

/** The scopes a token may be granted (kept in sync with runa-api scopes.ts). */
const API_SCOPES = [
  "task:read",
  "task:write",
  "project:read",
  "project:write",
  "comment:write",
  "label:write",
  "webhook:manage",
] as const;

/**
 * Scoped workspace API tokens. Admins mint revocable tokens that external
 * apps/integrations use as a bearer credential; each is limited to the granted
 * scopes and acts within the creator's access. The token plaintext is shown
 * once on create (the API only stores its hash). Admin-only, enforced
 * server-side; the badge is UX.
 */
const ApiTokensSettings = () => {
  const { organizationId } = useRouteContext({
    from: "/_app/@{$workspaceSlug}/~/settings",
  });

  const [name, setName] = useState("");
  const [scopes, setScopes] = useState<string[]>([]);
  const [revealedToken, setRevealedToken] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data } = useApiTokensQuery(
    { organizationId: organizationId! },
    { enabled: !!organizationId },
  );
  // hide already-revoked tokens; they are dead
  const tokens = (data?.apiTokens ?? []).filter((token) => !token.revoked);

  const invalidates = {
    meta: { invalidates: [getQueryKeyPrefix(useApiTokensQuery)] },
  };
  const onError = () => toast.error("Something went wrong. Please try again.");

  const { mutate: createToken, isPending: isCreating } =
    useCreateApiTokenMutation({
      ...invalidates,
      onError,
      onSuccess: (result) => {
        const token = result.createApiToken?.token;
        setName("");
        setScopes([]);
        if (token) setRevealedToken(token);
      },
    });

  const { mutate: revokeToken } = useRevokeApiTokenMutation({
    ...invalidates,
    onError,
    onSuccess: () => setRevokeTarget(null),
  });

  const toggleScope = (scope: string) =>
    setScopes((previous) =>
      previous.includes(scope)
        ? previous.filter((item) => item !== scope)
        : [...previous, scope],
    );

  const onAdd = (event: FormEvent) => {
    event.preventDefault();
    if (!organizationId || !name.trim() || scopes.length === 0) return;
    createToken({ organizationId, name: name.trim(), scopes });
  };

  const onCopyToken = async () => {
    if (!revealedToken) return;
    try {
      await navigator.clipboard.writeText(revealedToken);
      toast.success("Token copied to clipboard.");
    } catch {
      toast.error("Could not copy. Select and copy it manually.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="ml-2 flex items-center gap-2 font-medium text-base-700 text-sm lg:ml-0 dark:text-base-300">
        API tokens
        <span className="rounded bg-base-100 px-1.5 py-0.5 font-medium text-[10px] text-base-500 uppercase tracking-wide dark:bg-base-800">
          Admin only
        </span>
      </h2>

      <p className="ml-2 text-base-500 text-xs lg:ml-0">
        Scoped, revocable tokens for external apps to call the API on this
        workspace's behalf. The token is shown once when you create it.
      </p>

      <form onSubmit={onAdd} className="flex flex-col gap-2 px-2 pt-1 lg:px-0">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Token name (e.g. CI deploy)"
        />
        <div className="flex flex-wrap gap-2">
          {API_SCOPES.map((scope) => {
            const checked = scopes.includes(scope);
            return (
              <button
                key={scope}
                type="button"
                aria-pressed={checked}
                onClick={() => toggleScope(scope)}
                className={
                  checked
                    ? "rounded-full border border-primary bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs"
                    : "rounded-full border px-2 py-0.5 text-base-500 text-xs hover:text-base-800 dark:hover:text-base-200"
                }
              >
                {scope}
              </button>
            );
          })}
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isCreating || !name.trim() || scopes.length === 0}
          >
            Create token
          </Button>
        </div>
      </form>

      <div className="flex flex-col divide-y border-y">
        {tokens.length === 0 ? (
          <div className="flex h-10 w-full items-center pl-2 text-base-500 text-sm lg:pl-0">
            No tokens yet.
          </div>
        ) : (
          tokens.map((token) => (
            <div
              key={token.id}
              className="flex w-full items-center justify-between gap-2 py-2"
            >
              <div className="flex min-w-0 items-center gap-3 pl-2 lg:pl-0">
                <KeyIcon className="size-4 shrink-0 text-base-500" />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm">{token.name}</span>
                  <span className="truncate text-base-500 text-xs">
                    {(token.scopes ?? []).join(", ") || "no scopes"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 pr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Revoke token"
                  onClick={() =>
                    token.id &&
                    setRevokeTarget({ id: token.id, name: token.name ?? "" })
                  }
                >
                  <Trash2Icon />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* one-time token reveal */}
      <DialogRoot
        open={!!revealedToken}
        onOpenChange={(details) => {
          if (!details.open) setRevealedToken(null);
        }}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent className="w-full max-w-md rounded-lg bg-background">
            <DialogCloseTrigger />
            <div className="mb-4 flex flex-col gap-4">
              <DialogTitle>API token</DialogTitle>
              <DialogDescription>
                Copy this now. For your security it will not be shown again.
                Send it as a Bearer token in the Authorization header.
              </DialogDescription>
              <code className="block overflow-x-auto break-all rounded-md border bg-base-100 p-3 font-mono text-xs dark:bg-base-800">
                {revealedToken}
              </code>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onCopyToken}>
                Copy
              </Button>
              <Button onClick={() => setRevealedToken(null)}>Done</Button>
            </div>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>

      {/* destructive revoke confirmation */}
      <DialogRoot
        open={!!revokeTarget}
        onOpenChange={(details) => {
          if (!details.open) setRevokeTarget(null);
        }}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent className="w-full max-w-md rounded-lg bg-background">
            <DialogCloseTrigger />
            <div className="mb-4 flex flex-col gap-4">
              <DialogTitle>Revoke token?</DialogTitle>
              <DialogDescription>
                <span className="font-medium">{revokeTarget?.name}</span> will
                stop working immediately for anything using it. This cannot be
                undone.
              </DialogDescription>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRevokeTarget(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  revokeTarget && revokeToken({ id: revokeTarget.id })
                }
              >
                Revoke
              </Button>
            </div>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </div>
  );
};

export default ApiTokensSettings;
