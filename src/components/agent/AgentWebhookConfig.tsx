import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  ClipboardCopyIcon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  WebhookIcon,
} from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccessToken } from "@/lib/ai/hooks/useAccessToken";
import { API_BASE_URL } from "@/lib/config/env.config";
import agentWebhooksOptions, {
  agentWebhooksQueryKey,
} from "@/lib/options/agentWebhooks.options";
import { cn } from "@/lib/utils";

import type { AgentWebhook } from "@/lib/options/agentWebhooks.options";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const EVENT_TYPES = [
  { value: "github.pr_merged", label: "GitHub PR Merged" },
  { value: "github.issue_opened", label: "GitHub Issue Opened" },
  { value: "custom", label: "Custom Event" },
] as const;

// ─────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────

interface WebhookFormData {
  name: string;
  eventType: string;
  instructionTemplate: string;
}

interface CreateWebhookResponse {
  webhook: AgentWebhook;
  signingSecret: string;
}

const EMPTY_FORM: WebhookFormData = {
  name: "",
  eventType: "custom",
  instructionTemplate: "",
};

async function createWebhook(
  projectId: string,
  accessToken: string,
  form: WebhookFormData,
): Promise<CreateWebhookResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ai/webhooks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectId,
      name: form.name,
      eventType: form.eventType,
      instructionTemplate: form.instructionTemplate,
    }),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(err?.error ?? "Failed to create webhook");
  }

  return (await response.json()) as CreateWebhookResponse;
}

async function updateWebhook(
  webhookId: string,
  projectId: string,
  accessToken: string,
  form: WebhookFormData,
): Promise<AgentWebhook> {
  const response = await fetch(`${API_BASE_URL}/api/ai/webhooks/${webhookId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectId,
      name: form.name,
      eventType: form.eventType,
      instructionTemplate: form.instructionTemplate,
    }),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(err?.error ?? "Failed to update webhook");
  }

  const data = (await response.json()) as { webhook: AgentWebhook };
  return data.webhook;
}

async function toggleWebhook(
  webhookId: string,
  projectId: string,
  accessToken: string,
  enabled: boolean,
): Promise<AgentWebhook> {
  const response = await fetch(`${API_BASE_URL}/api/ai/webhooks/${webhookId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId, enabled }),
  });

  if (!response.ok) {
    throw new Error("Failed to toggle webhook");
  }

  const data = (await response.json()) as { webhook: AgentWebhook };
  return data.webhook;
}

async function deleteWebhook(
  webhookId: string,
  projectId: string,
  accessToken: string,
): Promise<void> {
  const url = new URL(`${API_BASE_URL}/api/ai/webhooks/${webhookId}`);
  url.searchParams.set("projectId", projectId);

  const response = await fetch(url.toString(), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(err?.error ?? "Failed to delete webhook");
  }
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

interface AgentWebhookConfigProps {
  projectId: string;
}

export function AgentWebhookConfig({ projectId }: AgentWebhookConfigProps) {
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();

  const { data: webhooks } = useSuspenseQuery(
    agentWebhooksOptions({ projectId, accessToken }),
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<WebhookFormData>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  // After creation, briefly show the signing secret and webhook URL
  const [createdSecret, setCreatedSecret] = useState<{
    webhookId: string;
    secret: string;
  } | null>(null);

  const resetForm = useCallback(() => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setIsFormOpen(false);
    setFormError(null);
  }, []);

  const openCreate = useCallback(() => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError(null);
    setCreatedSecret(null);
    setIsFormOpen(true);
  }, []);

  const openEdit = useCallback((webhook: AgentWebhook) => {
    setForm({
      name: webhook.name,
      eventType: webhook.eventType,
      instructionTemplate: webhook.instructionTemplate,
    });
    setEditingId(webhook.id);
    setFormError(null);
    setCreatedSecret(null);
    setIsFormOpen(true);
  }, []);

  const invalidateWebhooks = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: agentWebhooksQueryKey(projectId),
    });
  }, [queryClient, projectId]);

  const { mutate: saveWebhook, isPending: isSaving } = useMutation({
    mutationFn: async (): Promise<CreateWebhookResponse | AgentWebhook> => {
      if (!accessToken) throw new Error("Not authenticated");
      if (editingId) {
        return updateWebhook(editingId, projectId, accessToken, form);
      }
      return createWebhook(projectId, accessToken, form);
    },
    onSuccess: (result) => {
      invalidateWebhooks();
      // If create, show the signing secret
      if ("signingSecret" in result) {
        setCreatedSecret({
          webhookId: result.webhook.id,
          secret: result.signingSecret,
        });
        setIsFormOpen(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
      } else {
        resetForm();
      }
    },
    onError: (err) => {
      setFormError(
        err instanceof Error ? err.message : "Failed to save webhook",
      );
    },
  });

  const {
    mutate: removeWebhook,
    isPending: isDeleting,
    variables: deletingId,
  } = useMutation({
    mutationFn: (webhookId: string) => {
      if (!accessToken) throw new Error("Not authenticated");
      return deleteWebhook(webhookId, projectId, accessToken);
    },
    onSuccess: () => {
      invalidateWebhooks();
    },
  });

  const { mutate: toggle } = useMutation({
    mutationFn: ({
      webhookId,
      enabled,
    }: {
      webhookId: string;
      enabled: boolean;
    }) => {
      if (!accessToken) throw new Error("Not authenticated");
      return toggleWebhook(webhookId, projectId, accessToken, enabled);
    },
    onSuccess: () => {
      invalidateWebhooks();
    },
  });

  const handleSubmit = useCallback(() => {
    setFormError(null);
    if (!form.name.trim()) {
      setFormError("Name is required");
      return;
    }
    if (!form.instructionTemplate.trim()) {
      setFormError("Instruction template is required");
      return;
    }
    saveWebhook();
  }, [form, saveWebhook]);

  const updateField = useCallback(
    <K extends keyof WebhookFormData>(field: K, value: WebhookFormData[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setFormError(null);
    },
    [],
  );

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const webhookUrl = (webhookId: string) =>
    `${API_BASE_URL}/api/ai/webhook/${projectId}/${webhookId}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">Agent Webhooks</h3>
          <p className="text-muted-foreground text-xs">
            Trigger agent sessions from external events (e.g. GitHub).
          </p>
        </div>
        {!isFormOpen && (
          <Button
            variant="outline"
            size="sm"
            onClick={openCreate}
            className="h-7 gap-1 px-2 text-xs"
          >
            <PlusIcon className="size-3" />
            New Webhook
          </Button>
        )}
      </div>

      {/* Signing secret reveal (shown once after creation) */}
      {createdSecret && (
        <div className="flex flex-col gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
          <p className="font-medium text-amber-800 text-xs dark:text-amber-200">
            Webhook created! Copy the signing secret below — it won't be shown
            again.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-white px-2 py-1 font-mono text-xs dark:bg-black/20">
              {createdSecret.secret}
            </code>
            <Button
              variant="outline"
              size="icon"
              className="size-6"
              onClick={() => copyToClipboard(createdSecret.secret)}
              aria-label="Copy signing secret"
            >
              <ClipboardCopyIcon className="size-3" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-amber-700 text-xs dark:text-amber-300">
              URL:
            </span>
            <code className="flex-1 truncate rounded bg-white px-2 py-1 font-mono text-xs dark:bg-black/20">
              {webhookUrl(createdSecret.webhookId)}
            </code>
            <Button
              variant="outline"
              size="icon"
              className="size-6"
              onClick={() =>
                copyToClipboard(webhookUrl(createdSecret.webhookId))
              }
              aria-label="Copy webhook URL"
            >
              <ClipboardCopyIcon className="size-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 self-end text-xs"
            onClick={() => setCreatedSecret(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Webhook list */}
      {webhooks.length > 0 && !isFormOpen && (
        <div className="flex flex-col gap-1.5">
          {webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 p-2"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <WebhookIcon
                  className={cn(
                    "size-3.5 shrink-0",
                    webhook.enabled
                      ? "text-green-500"
                      : "text-muted-foreground",
                  )}
                />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-medium text-xs">
                    {webhook.name}
                  </span>
                  <span className="truncate text-[10px] text-muted-foreground">
                    {EVENT_TYPES.find((e) => e.value === webhook.eventType)
                      ?.label ?? webhook.eventType}
                    {webhook.lastTriggeredAt &&
                      ` — Last: ${new Date(webhook.lastTriggeredAt).toLocaleDateString()}`}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-[10px]"
                  onClick={() =>
                    toggle({
                      webhookId: webhook.id,
                      enabled: !webhook.enabled,
                    })
                  }
                >
                  {webhook.enabled ? "Disable" : "Enable"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => copyToClipboard(webhookUrl(webhook.id))}
                  aria-label="Copy webhook URL"
                >
                  <ClipboardCopyIcon className="size-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => openEdit(webhook)}
                  aria-label={`Edit ${webhook.name}`}
                >
                  <PencilIcon className="size-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => removeWebhook(webhook.id)}
                  disabled={isDeleting && deletingId === webhook.id}
                  aria-label={`Delete ${webhook.name}`}
                >
                  {isDeleting && deletingId === webhook.id ? (
                    <Loader2Icon className="size-3 animate-spin" />
                  ) : (
                    <TrashIcon className="size-3 text-destructive" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {webhooks.length === 0 && !isFormOpen && (
        <p className="py-2 text-center text-muted-foreground text-xs">
          No webhooks configured yet.
        </p>
      )}

      {/* Create/Edit form */}
      {isFormOpen && (
        <div className="flex flex-col gap-2 rounded-md border p-2.5">
          <p className="font-medium text-xs">
            {editingId ? "Edit Webhook" : "New Webhook"}
          </p>
          <Input
            placeholder="Webhook name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            disabled={isSaving}
            maxLength={100}
            className="text-sm"
          />
          <select
            value={form.eventType}
            onChange={(e) => updateField("eventType", e.target.value)}
            disabled={isSaving}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {EVENT_TYPES.map((evt) => (
              <option key={evt.value} value={evt.value}>
                {evt.label}
              </option>
            ))}
          </select>
          <textarea
            placeholder={`Instruction template — use {event} for the payload and {eventType} for the event type.\n\nExample: "A pull request was merged. Review the changes: {event}"`}
            value={form.instructionTemplate}
            onChange={(e) => updateField("instructionTemplate", e.target.value)}
            disabled={isSaving}
            maxLength={4000}
            rows={4}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          />
          {formError && <p className="text-destructive text-xs">{formError}</p>}
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetForm}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSubmit}
              disabled={
                isSaving ||
                !form.name.trim() ||
                !form.instructionTemplate.trim()
              }
            >
              {isSaving ? (
                <>
                  <Loader2Icon className="mr-1 size-3 animate-spin" />
                  Saving...
                </>
              ) : editingId ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
