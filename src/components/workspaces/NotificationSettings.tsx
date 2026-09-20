import { useRouteContext } from "@tanstack/react-router";
import { BellIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Switch } from "@/components/ui/switch";
import {
  useCreateNotificationPreferenceMutation,
  useNotificationPreferenceQuery,
  useUpdateNotificationPreferenceMutation,
} from "@/generated/graphql";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";

/**
 * Notification preferences for the current user.
 *
 * Preferences are user-global (they apply across every workspace); the section
 * lives here because this is the settings surface the app exposes today. The
 * preference row is created lazily on the first change, so a user with no row
 * yet defaults to enabled (opt-out model)
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

  // default to enabled when no row exists yet (opt-out model)
  const [emailTaskAssigned, setEmailTaskAssigned] = useState(true);
  // default to immediate delivery when no row exists yet
  const [isDigest, setIsDigest] = useState(false);

  useEffect(() => {
    if (preference) {
      setEmailTaskAssigned(preference.emailTaskAssigned);
      setIsDigest(preference.taskAssignedCadence === "digest");
    }
  }, [preference]);

  // revert the optimistic toggles if the write fails, so a switch never shows a
  // state that was not persisted (the query still holds the pre-toggle values)
  const mutationOptions = {
    meta: { invalidates: [getQueryKeyPrefix(useNotificationPreferenceQuery)] },
    onError: () => {
      setEmailTaskAssigned(preference?.emailTaskAssigned ?? true);
      setIsDigest(preference?.taskAssignedCadence === "digest");
    },
  };

  const { mutate: createPreference } =
    useCreateNotificationPreferenceMutation(mutationOptions);
  const { mutate: updatePreference } =
    useUpdateNotificationPreferenceMutation(mutationOptions);

  // persist a patch, creating the row lazily on first change
  const persist = (patch: {
    emailTaskAssigned?: boolean;
    taskAssignedCadence?: string;
  }) => {
    if (!userId) return;
    if (preference?.rowId) {
      updatePreference({ rowId: preference.rowId, patch });
    } else {
      createPreference({
        input: { notificationPreference: { userId, ...patch } },
      });
    }
  };

  const onToggle = (checked: boolean) => {
    if (!userId) return;
    // optimistic local update; the mutation reconciles/invalidates, onError rolls back
    setEmailTaskAssigned(checked);
    persist({ emailTaskAssigned: checked });
  };

  const onToggleDigest = (checked: boolean) => {
    if (!userId) return;
    setIsDigest(checked);
    persist({ taskAssignedCadence: checked ? "digest" : "immediate" });
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="ml-2 flex items-center gap-2 font-medium text-base-700 text-sm lg:ml-0 dark:text-base-300">
        Notifications
      </h2>

      <p className="ml-2 text-base-500 text-xs lg:ml-0">
        These preferences apply across all of your workspaces.
      </p>

      <div className="flex flex-col divide-y border-y">
        <div className="flex h-10 w-full items-center justify-between">
          <div className="flex items-center gap-3 pl-2 lg:pl-0">
            <BellIcon className="size-4 text-base-500" />
            <span className="text-sm">Email me when I'm assigned a task</span>
          </div>

          <div className="flex items-center gap-2 pr-2">
            <Switch
              checked={emailTaskAssigned}
              onCheckedChange={onToggle}
              disabled={!userId}
            />
          </div>
        </div>

        <div className="flex h-10 w-full items-center justify-between">
          <div className="flex items-center gap-3 pl-2 lg:pl-0">
            <BellIcon className="size-4 text-base-500" />
            <span className="text-sm">
              Batch assignment emails into a digest
            </span>
          </div>

          <div className="flex items-center gap-2 pr-2">
            <Switch
              checked={isDigest}
              onCheckedChange={onToggleDigest}
              disabled={!userId || !emailTaskAssigned}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
