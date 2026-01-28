import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarClockIcon,
  Loader2Icon,
  PencilIcon,
  PlayIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  agentSchedulesQueryKey,
  useAgentSchedules,
} from "@/lib/ai/hooks/useAgentSchedules";
import { useAgentPersonas } from "@/lib/ai/hooks/useAgentPersonas";
import { useAccessToken } from "@/lib/ai/hooks/useAccessToken";
import { API_BASE_URL } from "@/lib/config/env.config";
import { cn } from "@/lib/utils";

import type { AgentSchedule } from "@/lib/ai/hooks/useAgentSchedules";

// ─────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────

interface ScheduleFormData {
  name: string;
  cronExpression: string;
  instruction: string;
  personaId: string;
}

const EMPTY_FORM: ScheduleFormData = {
  name: "",
  cronExpression: "",
  instruction: "",
  personaId: "",
};

async function createSchedule(
  projectId: string,
  accessToken: string,
  form: ScheduleFormData,
): Promise<AgentSchedule> {
  const response = await fetch(`${API_BASE_URL}/api/ai/schedules`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectId,
      name: form.name,
      cronExpression: form.cronExpression,
      instruction: form.instruction,
      ...(form.personaId ? { personaId: form.personaId } : {}),
    }),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(err?.error ?? "Failed to create schedule");
  }

  const data = (await response.json()) as { schedule: AgentSchedule };
  return data.schedule;
}

async function updateSchedule(
  scheduleId: string,
  projectId: string,
  accessToken: string,
  form: ScheduleFormData,
): Promise<AgentSchedule> {
  const response = await fetch(
    `${API_BASE_URL}/api/ai/schedules/${scheduleId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId,
        name: form.name,
        cronExpression: form.cronExpression,
        instruction: form.instruction,
        personaId: form.personaId || null,
      }),
    },
  );

  if (!response.ok) {
    const err = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(err?.error ?? "Failed to update schedule");
  }

  const data = (await response.json()) as { schedule: AgentSchedule };
  return data.schedule;
}

async function toggleSchedule(
  scheduleId: string,
  projectId: string,
  accessToken: string,
  enabled: boolean,
): Promise<AgentSchedule> {
  const response = await fetch(
    `${API_BASE_URL}/api/ai/schedules/${scheduleId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId, enabled }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to toggle schedule");
  }

  const data = (await response.json()) as { schedule: AgentSchedule };
  return data.schedule;
}

async function deleteSchedule(
  scheduleId: string,
  projectId: string,
  accessToken: string,
): Promise<void> {
  const url = new URL(`${API_BASE_URL}/api/ai/schedules/${scheduleId}`);
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
    throw new Error(err?.error ?? "Failed to delete schedule");
  }
}

async function runNow(
  scheduleId: string,
  projectId: string,
  accessToken: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/ai/schedules/${scheduleId}/run`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId }),
    },
  );

  if (!response.ok) {
    const err = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(err?.error ?? "Failed to trigger schedule");
  }
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Human-readable cron description for common patterns. */
function describeCron(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5) return cron;

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  // Every minute
  if (minute === "*" && hour === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
    return "Every minute";
  }

  // Every N minutes
  const minuteInterval = minute?.match(/^\*\/(\d+)$/);
  if (minuteInterval && hour === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
    return `Every ${minuteInterval[1]} minutes`;
  }

  // Every hour at :MM
  if (minute?.match(/^\d+$/) && hour === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
    return `Every hour at :${minute.padStart(2, "0")}`;
  }

  // Daily at HH:MM
  if (minute?.match(/^\d+$/) && hour?.match(/^\d+$/) && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
    return `Daily at ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
  }

  // Weekdays at HH:MM
  if (minute?.match(/^\d+$/) && hour?.match(/^\d+$/) && dayOfMonth === "*" && month === "*" && dayOfWeek === "1-5") {
    return `Weekdays at ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
  }

  return cron;
}

function formatRelativeDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

interface AgentScheduleConfigProps {
  projectId: string;
  organizationId: string;
}

export function AgentScheduleConfig({
  projectId,
  organizationId,
}: AgentScheduleConfigProps) {
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();

  const { data: schedules = [], isLoading } = useAgentSchedules(projectId);
  const { data: personas = [] } = useAgentPersonas(organizationId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ScheduleFormData>(EMPTY_FORM);
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

  const openEdit = useCallback((schedule: AgentSchedule) => {
    setForm({
      name: schedule.name,
      cronExpression: schedule.cronExpression,
      instruction: schedule.instruction,
      personaId: schedule.personaId ?? "",
    });
    setEditingId(schedule.id);
    setFormError(null);
    setIsFormOpen(true);
  }, []);

  const invalidateSchedules = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: agentSchedulesQueryKey(projectId),
    });
  }, [queryClient, projectId]);

  const { mutate: saveSchedule, isPending: isSaving } = useMutation({
    mutationFn: async (): Promise<AgentSchedule> => {
      if (!accessToken) throw new Error("Not authenticated");
      if (editingId) {
        return updateSchedule(editingId, projectId, accessToken, form);
      }
      return createSchedule(projectId, accessToken, form);
    },
    onSuccess: () => {
      invalidateSchedules();
      resetForm();
    },
    onError: (err) => {
      setFormError(
        err instanceof Error ? err.message : "Failed to save schedule",
      );
    },
  });

  const {
    mutate: removeSchedule,
    isPending: isDeleting,
    variables: deletingId,
  } = useMutation({
    mutationFn: (scheduleId: string) => {
      if (!accessToken) throw new Error("Not authenticated");
      return deleteSchedule(scheduleId, projectId, accessToken);
    },
    onSuccess: () => {
      invalidateSchedules();
    },
  });

  const { mutate: toggle } = useMutation({
    mutationFn: ({
      scheduleId,
      enabled,
    }: {
      scheduleId: string;
      enabled: boolean;
    }) => {
      if (!accessToken) throw new Error("Not authenticated");
      return toggleSchedule(scheduleId, projectId, accessToken, enabled);
    },
    onSuccess: () => {
      invalidateSchedules();
    },
  });

  const {
    mutate: triggerRun,
    isPending: isTriggering,
    variables: triggeringId,
  } = useMutation({
    mutationFn: (scheduleId: string) => {
      if (!accessToken) throw new Error("Not authenticated");
      return runNow(scheduleId, projectId, accessToken);
    },
    onSuccess: () => {
      invalidateSchedules();
    },
  });

  const handleSubmit = useCallback(() => {
    setFormError(null);
    if (!form.name.trim()) {
      setFormError("Name is required");
      return;
    }
    if (!form.cronExpression.trim()) {
      setFormError("Cron expression is required");
      return;
    }
    if (!form.instruction.trim()) {
      setFormError("Instruction is required");
      return;
    }
    saveSchedule();
  }, [form, saveSchedule]);

  const updateField = useCallback(
    <K extends keyof ScheduleFormData>(
      field: K,
      value: ScheduleFormData[K],
    ) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setFormError(null);
    },
    [],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">Agent Schedules</h3>
          <p className="text-muted-foreground text-xs">
            Run agent sessions on a recurring schedule (cron-based).
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
            New Schedule
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 py-2 text-muted-foreground text-xs">
          <Loader2Icon className="size-3 animate-spin" />
          Loading schedules...
        </div>
      )}

      {/* Schedule list */}
      {schedules.length > 0 && !isFormOpen && (
        <div className="flex flex-col gap-1.5">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 p-2"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <CalendarClockIcon
                  className={cn(
                    "size-3.5 shrink-0",
                    schedule.enabled
                      ? "text-green-500"
                      : "text-muted-foreground",
                  )}
                />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-medium text-xs">
                    {schedule.name}
                  </span>
                  <span className="truncate text-[10px] text-muted-foreground">
                    {describeCron(schedule.cronExpression)}
                    {schedule.lastRunAt &&
                      ` — Last: ${formatRelativeDate(schedule.lastRunAt)}`}
                    {schedule.nextRunAt &&
                      schedule.enabled &&
                      ` — Next: ${new Date(schedule.nextRunAt).toLocaleString()}`}
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
                      scheduleId: schedule.id,
                      enabled: !schedule.enabled,
                    })
                  }
                >
                  {schedule.enabled ? "Disable" : "Enable"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => triggerRun(schedule.id)}
                  disabled={isTriggering && triggeringId === schedule.id}
                  aria-label={`Run ${schedule.name} now`}
                >
                  {isTriggering && triggeringId === schedule.id ? (
                    <Loader2Icon className="size-3 animate-spin" />
                  ) : (
                    <PlayIcon className="size-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => openEdit(schedule)}
                  aria-label={`Edit ${schedule.name}`}
                >
                  <PencilIcon className="size-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => removeSchedule(schedule.id)}
                  disabled={isDeleting && deletingId === schedule.id}
                  aria-label={`Delete ${schedule.name}`}
                >
                  {isDeleting && deletingId === schedule.id ? (
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

      {schedules.length === 0 && !isLoading && !isFormOpen && (
        <p className="py-2 text-center text-muted-foreground text-xs">
          No schedules configured yet.
        </p>
      )}

      {/* Create/Edit form */}
      {isFormOpen && (
        <div className="flex flex-col gap-2 rounded-md border p-2.5">
          <p className="font-medium text-xs">
            {editingId ? "Edit Schedule" : "New Schedule"}
          </p>
          <Input
            placeholder="Schedule name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            disabled={isSaving}
            maxLength={100}
            className="text-sm"
          />
          <Input
            placeholder="Cron expression (e.g. 0 9 * * 1-5 = weekdays at 9am)"
            value={form.cronExpression}
            onChange={(e) => updateField("cronExpression", e.target.value)}
            disabled={isSaving}
            className="font-mono text-sm"
          />
          {form.cronExpression && (
            <p className="text-muted-foreground text-[10px]">
              {describeCron(form.cronExpression)}
            </p>
          )}
          <textarea
            placeholder="Instruction for the agent (what should it do on each scheduled run?)"
            value={form.instruction}
            onChange={(e) => updateField("instruction", e.target.value)}
            disabled={isSaving}
            maxLength={4000}
            rows={3}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          />
          {personas.length > 0 && (
            <select
              value={form.personaId}
              onChange={(e) => updateField("personaId", e.target.value)}
              disabled={isSaving}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Default persona</option>
              {personas
                .filter((p) => p.enabled)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          )}
          {formError && (
            <p className="text-destructive text-xs">{formError}</p>
          )}
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
                !form.cronExpression.trim() ||
                !form.instruction.trim()
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
