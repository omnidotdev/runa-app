import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import {
  ChevronDownIcon,
  KeyIcon,
  Loader2Icon,
  SettingsIcon,
  TrashIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectControl,
  SelectIndicator,
  SelectItem,
  SelectItemGroup,
  SelectItemIndicator,
  SelectItemText,
  SelectPositioner,
  SelectTrigger,
  SelectValueText,
  createListCollection,
} from "@/components/ui/select";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { API_BASE_URL } from "@/lib/config/env.config";
import agentConfigOptions, {
  agentConfigQueryKey,
} from "@/lib/options/agentConfig.options";
import { AgentPersonaManager } from "./AgentPersonaManager";
import { AgentTokenUsage } from "./AgentTokenUsage";

import type {
  AgentConfig,
  AgentConfigResponse,
  ByokKeyInfo,
} from "@/lib/options/agentConfig.options";

// ─────────────────────────────────────────────
// Mutation API Functions
// ─────────────────────────────────────────────

async function updateAgentConfig(
  organizationId: string,
  accessToken: string,
  config: Partial<AgentConfig>,
): Promise<AgentConfig> {
  const response = await fetch(`${API_BASE_URL}/api/ai/config`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ organizationId, ...config }),
  });

  if (!response.ok) {
    throw new Error("Failed to update agent config");
  }

  const data = (await response.json()) as { config: AgentConfig };
  return data.config;
}

async function saveApiKey(
  organizationId: string,
  accessToken: string,
  apiKey: string,
): Promise<ByokKeyInfo> {
  const response = await fetch(`${API_BASE_URL}/api/ai/config/key`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ organizationId, apiKey }),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(err?.error ?? "Failed to save API key");
  }

  const data = (await response.json()) as { key: ByokKeyInfo };
  return data.key;
}

async function removeApiKey(
  organizationId: string,
  accessToken: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/ai/config/key`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ organizationId }),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(err?.error ?? "Failed to remove API key");
  }
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/**
 * Format an OpenRouter model name for display.
 * Converts "anthropic/claude-sonnet-4.5" to "Claude Sonnet 4.5 (Anthropic)"
 */
function formatModelName(model: string): string {
  const parts = model.split("/");
  if (parts.length !== 2) return model;

  const [provider, modelName] = parts;
  const formattedProvider =
    provider.charAt(0).toUpperCase() + provider.slice(1);
  const formattedModel = modelName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return `${formattedModel} (${formattedProvider})`;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function AgentConfigSection() {
  const { organizationId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/settings",
  });
  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/settings",
  });

  const accessToken = session?.accessToken!;
  const queryClient = useQueryClient();

  // Suspense query - data is prefetched in route loader, no loading state needed
  const { data } = useSuspenseQuery(
    agentConfigOptions({ organizationId: organizationId!, accessToken }),
  );

  const config = data.config;
  const allowedModels = data.allowedModels;

  // Create collection for model select
  const modelCollection = useMemo(
    () =>
      createListCollection({
        items: allowedModels.map((model) => ({
          label: formatModelName(model),
          value: model,
        })),
      }),
    [allowedModels],
  );

  // Local state for optimistic UI
  const [localConfig, setLocalConfig] = useState<AgentConfig>(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  // Mutations
  const { mutate: saveConfig, isPending: isSaving } = useMutation({
    mutationFn: (updates: Partial<AgentConfig>) =>
      updateAgentConfig(organizationId!, accessToken, updates),
    onSuccess: (saved) => {
      queryClient.setQueryData(
        agentConfigQueryKey(organizationId!),
        (prev: AgentConfigResponse | undefined) =>
          prev ? { ...prev, config: saved } : prev,
      );
    },
  });

  const { mutate: saveKey, isPending: isSavingKey } = useMutation({
    mutationFn: (apiKey: string) =>
      saveApiKey(organizationId!, accessToken, apiKey),
    onSuccess: (savedKey) => {
      queryClient.setQueryData(
        agentConfigQueryKey(organizationId!),
        (prev: AgentConfigResponse | undefined) =>
          prev
            ? { ...prev, config: { ...prev.config, byokKey: savedKey } }
            : prev,
      );
    },
  });

  const { mutate: deleteKey, isPending: isDeletingKey } = useMutation({
    mutationFn: () => removeApiKey(organizationId!, accessToken),
    onSuccess: () => {
      queryClient.setQueryData(
        agentConfigQueryKey(organizationId!),
        (prev: AgentConfigResponse | undefined) =>
          prev ? { ...prev, config: { ...prev.config, byokKey: null } } : prev,
      );
    },
  });

  const handleToggle = useCallback(
    (field: keyof AgentConfig, value: boolean) => {
      setLocalConfig((prev) => ({ ...prev, [field]: value }));
      saveConfig({ [field]: value });
    },
    [saveConfig],
  );

  const handleModelChange = useCallback(
    (model: string) => {
      setLocalConfig((prev) => ({ ...prev, model }));
      saveConfig({ model });
    },
    [saveConfig],
  );

  const handleMaxIterationsChange = useCallback((value: number) => {
    const clamped = Math.max(1, Math.min(20, value));
    setLocalConfig((prev) => ({ ...prev, maxIterationsPerRequest: clamped }));
  }, []);

  const handleMaxIterationsSave = useCallback(() => {
    saveConfig({
      maxIterationsPerRequest: localConfig.maxIterationsPerRequest,
    });
  }, [localConfig.maxIterationsPerRequest, saveConfig]);

  const [customInstructionsDraft, setCustomInstructionsDraft] = useState(
    config.customInstructions ?? "",
  );

  useEffect(() => {
    setCustomInstructionsDraft(config.customInstructions ?? "");
  }, [config.customInstructions]);

  const handleSaveInstructions = useCallback(() => {
    const value = customInstructionsDraft.trim() || null;
    setLocalConfig((prev) => ({ ...prev, customInstructions: value }));
    saveConfig({ customInstructions: value });
  }, [customInstructionsDraft, saveConfig]);

  // BYOK key management state
  const [isKeyFormOpen, setIsKeyFormOpen] = useState(false);
  const [keyValue, setKeyValue] = useState("");
  const [keyError, setKeyError] = useState<string | null>(null);

  const handleSaveKey = useCallback(() => {
    setKeyError(null);
    if (keyValue.length < 10) {
      setKeyError("API key must be at least 10 characters");
      return;
    }
    saveKey(keyValue, {
      onSuccess: () => {
        setLocalConfig((prev) => ({ ...prev, byokKey: { maskedKey: "..." } }));
        setIsKeyFormOpen(false);
        setKeyValue("");
        setKeyError(null);
      },
      onError: (err) => {
        setKeyError(err instanceof Error ? err.message : "Failed to save key");
      },
    });
  }, [keyValue, saveKey]);

  const handleDeleteKey = useCallback(() => {
    deleteKey(undefined, {
      onSuccess: () => {
        setLocalConfig((prev) => ({ ...prev, byokKey: null }));
      },
    });
  }, [deleteKey]);

  return (
    <div className="flex flex-col">
      <div className="mb-1 flex h-10 items-center gap-2">
        <SettingsIcon className="size-4 text-muted-foreground" />
        <h2 className="font-semibold text-lg">Agent Settings</h2>
        {isSaving && (
          <Loader2Icon className="size-3.5 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Model Selection */}
      <div className="flex flex-col gap-2 rounded-lg border p-3">
        <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          Model Selection
        </h3>
        <p className="text-muted-foreground text-xs">
          Choose the AI model for your agent. Powered by{" "}
          <a
            href="https://openrouter.ai/models"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            OpenRouter
          </a>
          .
        </p>
        <Select
          collection={modelCollection}
          value={[localConfig.model]}
          onValueChange={(details) => {
            const newModel = details.value[0];
            if (newModel) handleModelChange(newModel);
          }}
          disabled={isSaving}
        >
          <SelectControl>
            <SelectTrigger
              aria-label="AI model"
              className="w-full justify-between border border-input bg-transparent"
            >
              <SelectValueText placeholder="Select a model" />
              <SelectIndicator>
                <ChevronDownIcon />
              </SelectIndicator>
            </SelectTrigger>
          </SelectControl>

          <SelectPositioner>
            <SelectContent className="w-(--reference-width)">
              <SelectItemGroup>
                {modelCollection.items.map((item) => (
                  <SelectItem key={item.value} item={item}>
                    <SelectItemText>{item.label}</SelectItemText>
                    <SelectItemIndicator />
                  </SelectItem>
                ))}
              </SelectItemGroup>
            </SelectContent>
          </SelectPositioner>
        </Select>
      </div>

      {/* Approval Controls */}
      <div className="mt-4 flex flex-col gap-1 rounded-lg border p-3">
        <h3 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
          Approval Controls
        </h3>

        <ToggleSwitch
          checked={localConfig.requireApprovalForDestructive}
          onChange={(v) => handleToggle("requireApprovalForDestructive", v)}
          disabled={isSaving}
          label="Require approval for destructive actions"
          description="Delete, batch move, batch update, and batch delete will pause for user approval."
        />

        <ToggleSwitch
          checked={localConfig.requireApprovalForCreate}
          onChange={(v) => handleToggle("requireApprovalForCreate", v)}
          disabled={isSaving}
          label="Require approval for task creation"
          description="Creating new tasks will pause for user approval."
        />
      </div>

      {/* Agent Behavior */}
      <div className="mt-4 flex flex-col gap-2 rounded-lg border p-3">
        <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          Agent Behavior
        </h3>

        <div className="flex items-center justify-between gap-4 p-2">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-sm">
              Max iterations per request
            </span>
            <span className="text-muted-foreground text-xs">
              Maximum tool call loops before the agent stops (1-20).
            </span>
          </div>
          <Input
            type="number"
            min={1}
            max={20}
            value={localConfig.maxIterationsPerRequest}
            onChange={(e) =>
              handleMaxIterationsChange(
                Number.parseInt(e.target.value, 10) || 10,
              )
            }
            onBlur={handleMaxIterationsSave}
            disabled={isSaving}
            className="w-20"
          />
        </div>
      </div>

      {/* Custom Instructions */}
      <div className="mt-4 flex flex-col gap-2 rounded-lg border p-3">
        <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          Custom Instructions
        </h3>
        <p className="text-muted-foreground text-xs">
          Additional instructions appended to the agent&apos;s system prompt.
        </p>
        <textarea
          value={customInstructionsDraft}
          onChange={(e) => setCustomInstructionsDraft(e.target.value)}
          disabled={isSaving}
          placeholder="e.g., Always use high priority for security-related tasks..."
          maxLength={2000}
          rows={3}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveInstructions}
            disabled={
              isSaving ||
              (customInstructionsDraft.trim() || null) ===
                (localConfig.customInstructions ?? null)
            }
          >
            Save Instructions
          </Button>
        </div>
      </div>

      {/* BYOK API Key */}
      <div className="mt-4 flex flex-col gap-2 rounded-lg border p-3">
        <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          OpenRouter API Key (BYOK)
        </h3>
        <p className="text-muted-foreground text-xs">
          Provide your own OpenRouter API key. When set, the agent uses your key
          instead of the shared platform key.{" "}
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Get your key
          </a>
        </p>

        {localConfig.byokKey && !isKeyFormOpen && (
          <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 p-2.5">
            <div className="flex items-center gap-2">
              <KeyIcon className="size-3.5 text-muted-foreground" />
              <span className="font-mono text-sm">
                {localConfig.byokKey.maskedKey}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsKeyFormOpen(true)}
                disabled={isDeletingKey}
              >
                Replace
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteKey}
                disabled={isDeletingKey}
                aria-label="Remove API key"
              >
                {isDeletingKey ? (
                  <Loader2Icon className="size-3.5 animate-spin" />
                ) : (
                  <TrashIcon className="size-3.5 text-destructive" />
                )}
              </Button>
            </div>
          </div>
        )}

        {(isKeyFormOpen || !localConfig.byokKey) && (
          <div className="flex flex-col gap-2">
            <Input
              type="password"
              value={keyValue}
              onChange={(e) => {
                setKeyValue(e.target.value);
                setKeyError(null);
              }}
              placeholder="sk-or-..."
              disabled={isSavingKey}
              autoComplete="off"
            />
            {keyError && <p className="text-destructive text-xs">{keyError}</p>}
            <div className="flex justify-end gap-2">
              {isKeyFormOpen && localConfig.byokKey && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsKeyFormOpen(false);
                    setKeyValue("");
                    setKeyError(null);
                  }}
                  disabled={isSavingKey}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveKey}
                disabled={isSavingKey || keyValue.length < 10}
              >
                {isSavingKey ? (
                  <>
                    <Loader2Icon className="mr-1 size-3 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Key"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      <AgentPersonaManager organizationId={organizationId!} />

      <AgentTokenUsage organizationId={organizationId!} />
    </div>
  );
}
