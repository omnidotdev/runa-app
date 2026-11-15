import { useRouteContext } from "@tanstack/react-router";
import { BellIcon } from "lucide-react";
import { Fragment, useEffect, useState } from "react";

import { Switch } from "@/components/ui/switch";
import {
  useCreateNotificationPreferenceMutation,
  useNotificationPreferenceQuery,
  useUpdateNotificationPreferenceMutation,
} from "@/generated/graphql";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";

/** Email toggles, each backed by a boolean preference column */
const EMAIL_TOGGLES = [
  { key: "emailTaskAssigned", label: "Email me when I'm assigned a task" },
  {
    key: "emailTaskComment",
    label: "Email me about comments on tasks I'm involved in",
  },
  { key: "emailTaskMention", label: "Email me when someone mentions me" },
  {
    key: "emailTaskMoved",
    label: "Email me when a task I'm involved in moves to another project",
  },
] as const;

type ToggleKey = (typeof EMAIL_TOGGLES)[number]["key"];

type Toggles = Record<ToggleKey, boolean>;

/** Everything is on until the user opts out (no row yet means enabled) */
const DEFAULT_TOGGLES: Toggles = {
  emailTaskAssigned: true,
  emailTaskComment: true,
  emailTaskMention: true,
  emailTaskMoved: true,
};

/**
 * Notification preferences for the current user.
 *
 * Preferences are user-global (they apply across every workspace); the section
 * lives here because this is the settings surface the app exposes today. The
 * preference row is created lazily on the first change, so a user with no row
 * yet defaults to enabled (opt-out model). "Involved" means the user created,
 * is assigned to, or commented on the task
 */
const NotificationSettings = () => {
  const { session } = useRouteContext({
    from: "/_app/@{$workspaceSlug}/~/settings",
  });

  const userId = session?.user?.rowId;

  const { data } = useNotificationPreferenceQuery(
    { userId: userId! },
    { enabled: !!userId },
  );

  const preference = data?.notificationPreferenceByUserId;

  const persisted = (): Toggles =>
    preference
      ? {
          emailTaskAssigned: preference.emailTaskAssigned,
          emailTaskComment: preference.emailTaskComment,
          emailTaskMention: preference.emailTaskMention,
          emailTaskMoved: preference.emailTaskMoved,
        }
      : DEFAULT_TOGGLES;

  const [toggles, setToggles] = useState<Toggles>(DEFAULT_TOGGLES);
  // default to immediate delivery when no row exists yet
  const [isDigest, setIsDigest] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: sync local state only when the stored preference changes
  useEffect(() => {
    if (preference) {
      setToggles(persisted());
      setIsDigest(preference.taskAssignedCadence === "digest");
    }
  }, [preference]);

  // revert the optimistic toggles if the write fails, so a switch never shows a
  // state that was not persisted (the query still holds the pre-toggle values)
  const mutationOptions = {
    meta: { invalidates: [getQueryKeyPrefix(useNotificationPreferenceQuery)] },
    onError: () => {
      setToggles(persisted());
      setIsDigest(preference?.taskAssignedCadence === "digest");
    },
  };

  const { mutate: createPreference } =
    useCreateNotificationPreferenceMutation(mutationOptions);
  const { mutate: updatePreference } =
    useUpdateNotificationPreferenceMutation(mutationOptions);

  // persist a patch, creating the row lazily on first change
  const persist = (
    patch: Partial<Toggles> & { taskAssignedCadence?: string },
  ) => {
    if (!userId) return;
    if (preference?.rowId) {
      updatePreference({ rowId: preference.rowId, patch });
    } else {
      createPreference({
        input: { notificationPreference: { userId, ...patch } },
      });
    }
  };

  const onToggle = (key: ToggleKey, checked: boolean) => {
    if (!userId) return;
    // optimistic local update; the mutation reconciles/invalidates, onError rolls back
    setToggles((prev) => ({ ...prev, [key]: checked }));
    persist({ [key]: checked });
  };

  const onToggleDigest = (checked: boolean) => {
    if (!userId) return;
    setIsDigest(checked);
    persist({ taskAssignedCadence: checked ? "digest" : "immediate" });
  };

  const row = (
    label: string,
    checked: boolean,
    onCheckedChange: (checked: boolean) => void,
    disabled: boolean,
  ) => (
    <div
      key={label}
      className="flex min-h-10 w-full items-center justify-between gap-4 py-2"
    >
      <div className="flex items-center gap-3 pl-2 lg:pl-0">
        <BellIcon className="text-base-500 size-4 shrink-0" />
        <span className="text-sm">{label}</span>
      </div>

      <div className="flex items-center gap-2 pr-2">
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-base-700 dark:text-base-300 ml-2 flex items-center gap-2 text-sm font-medium lg:ml-0">
        Notifications
      </h2>

      <p className="text-base-500 ml-2 text-xs lg:ml-0">
        These preferences apply across all of your workspaces. A task you're
        involved in is one you created, are assigned to, or commented on.
      </p>

      <div className="flex flex-col divide-y border-y">
        {EMAIL_TOGGLES.map(({ key, label }) => (
          <Fragment key={key}>
            {row(
              label,
              toggles[key],
              (checked) => onToggle(key, checked),
              !userId,
            )}
            {key === "emailTaskAssigned" &&
              row(
                "Batch assignment emails into a digest",
                isDigest,
                onToggleDigest,
                !userId || !toggles.emailTaskAssigned,
              )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;
