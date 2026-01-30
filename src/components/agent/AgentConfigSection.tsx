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
      {/* Section Header */}
      <div className="mb-3 flex items-center gap-2">
        <SettingsIcon className="size-4 text-muted-foreground" />
        <h2 className="text-balance font-semibold text-lg">Agent Settings</h2>
        {isSaving && (
          <Loader2Icon className="size-3.5 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Unified Card Container */}
      <div className="rounded-lg border">
        {/* Usage Stats - Compact Header Row */}
        <AgentTokenUsage organizationId={organizationId!} />

        {/* Model & Iterations Row */}
        <div className="flex flex-col gap-1.5 border-t p-4">
          <span className="font-medium text-sm">Model</span>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            {/* Model Selection */}
            <Select
              collection={modelCollection}
              value={[localConfig.model]}
              onValueChange={(details) => {
                const newModel = details.value[0];
                if (newModel) handleModelChange(newModel);
              }}
              disabled={isSaving}
              className="flex-1"
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

            {/* Max Iterations - Inline with select */}
            <div className="flex shrink-0 items-center gap-2">
              <span className="whitespace-nowrap text-muted-foreground text-sm">
                Max iterations
              </span>
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
                aria-label="Max iterations"
                className="w-16 text-center"
              />
            </div>
          </div>
          <p className="text-pretty text-muted-foreground text-xs">
            Powered by{" "}
            <a
              href="https://openrouter.ai/models"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              OpenRouter
            </a>
          </p>
        </div>

        {/* Approval Controls */}
        <div className="flex flex-col gap-1 border-t p-4">
          <h3 className="mb-1 font-medium text-sm">Approval Controls</h3>
          <ToggleSwitch
            checked={localConfig.requireApprovalForDestructive}
            onChange={(v) => handleToggle("requireApprovalForDestructive", v)}
            disabled={isSaving}
            label="Destructive actions"
            description="Delete operations (tasks, columns, batch delete) require approval"
          />
          <ToggleSwitch
            checked={localConfig.requireApprovalForCreate}
            onChange={(v) => handleToggle("requireApprovalForCreate", v)}
            disabled={isSaving}
            label="Task creation"
            description="New tasks require approval before creation"
          />
        </div>

        {/* Custom Instructions */}
        <div className="flex flex-col gap-2 border-t p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Custom Instructions</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveInstructions}
              disabled={
                isSaving ||
                (customInstructionsDraft.trim() || null) ===
                  (localConfig.customInstructions ?? null)
              }
              className="h-7 px-2 text-xs"
            >
              Save
            </Button>
          </div>
          <textarea
            value={customInstructionsDraft}
            onChange={(e) => setCustomInstructionsDraft(e.target.value)}
            disabled={isSaving}
            placeholder="e.g., Always use high priority for security-related tasks..."
            maxLength={2000}
            rows={2}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* BYOK API Key */}
        <div className="flex flex-col gap-2 border-t p-4">
          <h3 className="font-medium text-sm">OpenRouter API Key</h3>
          <p className="text-pretty text-muted-foreground text-xs">
            Use your own key instead of the shared platform key.{" "}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Get a key
            </a>
          </p>

          {localConfig.byokKey && !isKeyFormOpen ? (
            <div className="flex items-center justify-between gap-3 rounded-md bg-muted/50 px-3 py-2">
              <div className="flex items-center gap-2">
                <KeyIcon className="size-3.5 text-muted-foreground" />
                <span className="font-mono text-sm">
                  {localConfig.byokKey.maskedKey}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsKeyFormOpen(true)}
                  disabled={isDeletingKey}
                  className="h-7 px-2 text-xs"
                >
                  Replace
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDeleteKey}
                  disabled={isDeletingKey}
                  aria-label="Remove API key"
                  className="size-7"
                >
                  {isDeletingKey ? (
                    <Loader2Icon className="size-3.5 animate-spin" />
                  ) : (
                    <TrashIcon className="size-3.5 text-destructive" />
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
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
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveKey}
                  disabled={isSavingKey || keyValue.length < 10}
                  className="shrink-0"
                >
                  {isSavingKey ? (
                    <Loader2Icon className="size-3.5 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
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
              </div>
              {keyError && (
                <p className="text-destructive text-xs">{keyError}</p>
              )}
            </div>
          )}
        </div>

        {/* Personas */}
        <AgentPersonaManager organizationId={organizationId!} />
      </div>
    </div>
  );
}
