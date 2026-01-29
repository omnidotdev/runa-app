import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  CalendarClockIcon,
  ChevronDownIcon,
  Loader2Icon,
  PencilIcon,
  PlayIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

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
  SelectLabel,
  SelectPositioner,
  SelectTrigger,
  SelectValueText,
  createListCollection,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAccessToken } from "@/lib/ai/hooks/useAccessToken";
import { API_BASE_URL } from "@/lib/config/env.config";
import agentPersonasOptions from "@/lib/options/agentPersonas.options";
import agentSchedulesOptions, {
  agentSchedulesQueryKey,
} from "@/lib/options/agentSchedules.options";
import { cn } from "@/lib/utils";

import type { AgentSchedule } from "@/lib/options/agentSchedules.options";

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
  if (
    minute === "*" &&
    hour === "*" &&
    dayOfMonth === "*" &&
    month === "*" &&
    dayOfWeek === "*"
  ) {
    return "Every minute";
  }

  // Every N minutes
  const minuteInterval = minute?.match(/^\*\/(\d+)$/);
  if (
    minuteInterval &&
    hour === "*" &&
    dayOfMonth === "*" &&
    month === "*" &&
    dayOfWeek === "*"
  ) {
    return `Every ${minuteInterval[1]} minutes`;
  }

  // Every hour at :MM
  if (
    minute?.match(/^\d+$/) &&
    hour === "*" &&
    dayOfMonth === "*" &&
    month === "*" &&
    dayOfWeek === "*"
  ) {
    return `Every hour at :${minute.padStart(2, "0")}`;
  }

  // Daily at HH:MM
  if (
    minute?.match(/^\d+$/) &&
    hour?.match(/^\d+$/) &&
    dayOfMonth === "*" &&
    month === "*" &&
    dayOfWeek === "*"
  ) {
    return `Daily at ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
  }

  // Weekdays at HH:MM
  if (
    minute?.match(/^\d+$/) &&
    hour?.match(/^\d+$/) &&
    dayOfMonth === "*" &&
    month === "*" &&
    dayOfWeek === "1-5"
  ) {
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

  const { data: schedules } = useSuspenseQuery(
    agentSchedulesOptions({ projectId, accessToken }),
  );
  const { data: personas = [] } = useQuery({
    ...agentPersonasOptions({ organizationId, accessToken }),
    select: (data) => data ?? [],
  });

  const personaCollection = useMemo(() => {
    const enabledPersonas = personas.filter((p) => p.enabled);
    return createListCollection({
      items: [
        { label: "Default persona", value: "" },
        ...enabledPersonas.map((p) => ({ label: p.name, value: p.id })),
      ],
    });
  }, [personas]);

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

      {schedules.length === 0 && !isFormOpen && (
        <p className="py-2 text-center text-muted-foreground text-xs">
          No schedules configured yet.
        </p>
      )}

      {/* Create/Edit form */}
      {isFormOpen && (
        <div className="rounded-lg border">
          <div className="border-b bg-muted/30 px-4 py-3">
            <h4 className="font-medium text-sm">
              {editingId ? "Edit Schedule" : "New Schedule"}
            </h4>
            <p className="text-muted-foreground text-xs">
              Configure a schedule to run agent sessions automatically.
            </p>
          </div>

          <div className="flex flex-col gap-4 p-4">
            {/* Name Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="schedule-name"
                className="font-medium text-muted-foreground text-xs"
              >
                Name
              </label>
              <Input
                id="schedule-name"
                placeholder="e.g., Daily Standup Summary"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                disabled={isSaving}
                maxLength={100}
                className="text-sm"
              />
            </div>

            {/* Cron Expression Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="schedule-cron"
                className="font-medium text-muted-foreground text-xs"
              >
                Cron Expression
              </label>
              <Input
                id="schedule-cron"
                placeholder="e.g., 0 9 * * 1-5"
                value={form.cronExpression}
                onChange={(e) => updateField("cronExpression", e.target.value)}
                disabled={isSaving}
                className="font-mono text-sm"
              />
              {form.cronExpression ? (
                <p className="text-muted-foreground text-xs">
                  {describeCron(form.cronExpression)}
                </p>
              ) : (
                <p className="text-muted-foreground text-xs">
                  Example:{" "}
                  <code className="rounded bg-muted px-1">0 9 * * 1-5</code> =
                  Weekdays at 9:00 AM
                </p>
              )}
            </div>

            {/* Instruction Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="schedule-instruction"
                className="font-medium text-muted-foreground text-xs"
              >
                Instruction
              </label>
              <Textarea
                id="schedule-instruction"
                placeholder="e.g., Review all open tasks and create a daily summary..."
                value={form.instruction}
                onChange={(e) => updateField("instruction", e.target.value)}
                disabled={isSaving}
                maxLength={4000}
                rows={3}
                className="text-sm"
              />
            </div>

            {/* Persona Field */}
            {personas.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <Select
                  collection={personaCollection}
                  value={[form.personaId]}
                  onValueChange={(details) => {
                    const newPersonaId = details.value[0];
                    updateField("personaId", newPersonaId ?? "");
                  }}
                  disabled={isSaving}
                >
                  <SelectLabel>Persona</SelectLabel>
                  <SelectControl>
                    <SelectTrigger className="w-full justify-between border border-input bg-transparent">
                      <SelectValueText placeholder="Default persona" />
                      <SelectIndicator>
                        <ChevronDownIcon />
                      </SelectIndicator>
                    </SelectTrigger>
                  </SelectControl>

                  <SelectPositioner>
                    <SelectContent className="w-(--reference-width)">
                      <SelectItemGroup>
                        {personaCollection.items.map((item) => (
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
            )}

            {/* Error Display */}
            {formError && (
              <p className="text-destructive text-xs">{formError}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 border-t bg-muted/30 px-4 py-3">
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
