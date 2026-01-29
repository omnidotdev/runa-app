import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import {
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import { memo, useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  agentPersonasQueryKey,
  useAgentPersonas,
} from "@/lib/ai/hooks/useAgentPersonas";
import { API_BASE_URL } from "@/lib/config/env.config";

import type { AgentPersona } from "@/lib/ai/hooks/useAgentPersonas";

interface AgentPersonaManagerProps {
  organizationId: string;
}

interface PersonaFormData {
  name: string;
  description: string;
  systemPrompt: string;
  icon: string;
}

const EMPTY_FORM: PersonaFormData = {
  name: "",
  description: "",
  systemPrompt: "",
  icon: "",
};

async function createPersona(
  organizationId: string,
  accessToken: string,
  form: PersonaFormData,
): Promise<AgentPersona> {
  const response = await fetch(`${API_BASE_URL}/api/ai/personas`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      organizationId,
      name: form.name,
      systemPrompt: form.systemPrompt,
      description: form.description || undefined,
      icon: form.icon || undefined,
    }),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(err?.error ?? "Failed to create persona");
  }

  const data = (await response.json()) as { persona: AgentPersona };
  return data.persona;
}

async function updatePersona(
  personaId: string,
  organizationId: string,
  accessToken: string,
  form: PersonaFormData,
): Promise<AgentPersona> {
  const response = await fetch(`${API_BASE_URL}/api/ai/personas/${personaId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      organizationId,
      name: form.name,
      systemPrompt: form.systemPrompt,
      description: form.description || null,
      icon: form.icon || null,
    }),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(err?.error ?? "Failed to update persona");
  }

  const data = (await response.json()) as { persona: AgentPersona };
  return data.persona;
}

async function deletePersona(
  personaId: string,
  organizationId: string,
  accessToken: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/ai/personas/${personaId}`, {
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
    throw new Error(err?.error ?? "Failed to delete persona");
  }
}

// ─────────────────────────────────────────────
// Memoized List Item
// ─────────────────────────────────────────────

interface PersonaListItemProps {
  persona: AgentPersona;
  onEdit: (persona: AgentPersona) => void;
  onDelete: (personaId: string) => void;
  isDeleting: boolean;
}

const PersonaListItem = memo(function PersonaListItem({
  persona,
  onEdit,
  onDelete,
  isDeleting,
}: PersonaListItemProps) {
  const handleEdit = useCallback(() => onEdit(persona), [onEdit, persona]);
  const handleDelete = useCallback(
    () => onDelete(persona.id),
    [onDelete, persona.id],
  );

  return (
    <div className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 p-2">
      <div className="flex items-center gap-2 overflow-hidden">
        <span className="shrink-0 text-sm">
          {persona.icon ?? (
            <UserIcon className="size-3.5 text-muted-foreground" />
          )}
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-xs">{persona.name}</span>
          {persona.description && (
            <span className="truncate text-[10px] text-muted-foreground">
              {persona.description}
            </span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={handleEdit}
          aria-label={`Edit ${persona.name}`}
        >
          <PencilIcon className="size-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label={`Delete ${persona.name}`}
        >
          {isDeleting ? (
            <Loader2Icon className="size-3 animate-spin" />
          ) : (
            <TrashIcon className="size-3 text-destructive" />
          )}
        </Button>
      </div>
    </div>
  );
});

export function AgentPersonaManager({
  organizationId,
}: AgentPersonaManagerProps) {
  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/settings",
  });
  const accessToken = session?.accessToken;
  const queryClient = useQueryClient();

  const { data: personas = [], isLoading } = useAgentPersonas(organizationId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PersonaFormData>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

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
    setIsFormOpen(true);
  }, []);

  const openEdit = useCallback((persona: AgentPersona) => {
    setForm({
      name: persona.name,
      description: persona.description ?? "",
      systemPrompt: persona.systemPrompt,
      icon: persona.icon ?? "",
    });
    setEditingId(persona.id);
    setFormError(null);
    setIsFormOpen(true);
  }, []);

  const invalidatePersonas = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: agentPersonasQueryKey(organizationId),
    });
  }, [queryClient, organizationId]);

  const { mutate: savePersona, isPending: isSaving } = useMutation({
    mutationFn: () => {
      if (!accessToken) throw new Error("Not authenticated");
      return editingId
        ? updatePersona(editingId, organizationId, accessToken, form)
        : createPersona(organizationId, accessToken, form);
    },
    onSuccess: () => {
      invalidatePersonas();
      resetForm();
    },
    onError: (err) => {
      setFormError(
        err instanceof Error ? err.message : "Failed to save persona",
      );
    },
  });

  const { mutate: removePersona, isPending: isDeleting } = useMutation({
    mutationFn: (personaId: string) => {
      if (!accessToken) throw new Error("Not authenticated");
      return deletePersona(personaId, organizationId, accessToken);
    },
    onSuccess: () => {
      invalidatePersonas();
    },
  });

  const handleSubmit = useCallback(() => {
    setFormError(null);
    if (!form.name.trim()) {
      setFormError("Name is required");
      return;
    }
    if (!form.systemPrompt.trim()) {
      setFormError("System prompt is required");
      return;
    }
    savePersona();
  }, [form, savePersona]);

  const updateField = useCallback(
    <K extends keyof PersonaFormData>(field: K, value: PersonaFormData[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setFormError(null);
    },
    [],
  );

  return (
    <div className="mt-4 flex flex-col gap-2 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          Personas
        </h3>
        {!isFormOpen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={openCreate}
            className="h-6 gap-1 px-2 text-xs"
          >
            <PlusIcon className="size-3" />
            New
          </Button>
        )}
      </div>
      <p className="text-muted-foreground text-xs">
        Create specialized agent personas with custom system prompts.
      </p>

      {isLoading && (
        <div className="flex items-center gap-2 py-2 text-muted-foreground text-xs">
          <Loader2Icon className="size-3 animate-spin" />
          Loading personas...
        </div>
      )}

      {/* Persona list */}
      {personas.length > 0 && !isFormOpen && (
        <div className="flex flex-col gap-1.5">
          {personas.map((persona) => (
            <PersonaListItem
              key={persona.id}
              persona={persona}
              onEdit={openEdit}
              onDelete={removePersona}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}

      {/* Create/Edit form */}
      {isFormOpen && (
        <div className="flex flex-col gap-2 rounded-md border p-2.5">
          <p className="font-medium text-xs">
            {editingId ? "Edit Persona" : "New Persona"}
          </p>
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            disabled={isSaving}
            maxLength={100}
            className="text-sm"
          />
          <Input
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            disabled={isSaving}
            maxLength={500}
            className="text-sm"
          />
          <Input
            placeholder="Icon emoji (optional)"
            value={form.icon}
            onChange={(e) => updateField("icon", e.target.value)}
            disabled={isSaving}
            maxLength={10}
            className="w-24 text-sm"
          />
          <textarea
            placeholder="System prompt — defines this persona's role and behavior..."
            value={form.systemPrompt}
            onChange={(e) => updateField("systemPrompt", e.target.value)}
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
                isSaving || !form.name.trim() || !form.systemPrompt.trim()
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
