import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Tooltip } from "@/components/core";
import { Button } from "@/components/ui/button";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import labelsOptions from "@/lib/options/labels.options";
import { Role } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import LabelForm from "./ProjectLabelForm";

import type { LabelFragment as Label } from "@/generated/graphql";

const ProjectLabelsForm = () => {
  const [isCreatingLabel, setIsCreatingLabel] = useState(false);
  const [activeLabelId, setActiveLabelId] = useState<string | null>(null);

  const { projectId, organizationId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/settings",
  });

  const role = useCurrentUserRole(organizationId);
  const isMember = role === Role.Member;

  const { data: labels } = useQuery({
    ...labelsOptions({ projectId }),
    select: (data) => data?.labels?.nodes,
  });

  const [localLabels, setLocalLabels] = useState<Label[]>(labels ?? []);

  const handleSetActiveLabel = (rowId: string | null) => {
    setActiveLabelId(rowId);
    if (rowId === null) {
      setIsCreatingLabel(false);
    }
  };

  const handleCreateNewLabel = () => {
    setIsCreatingLabel(true);
    setActiveLabelId("pending");
  };

  const hasLabels = !!localLabels?.length;
  const showEmptyState = !hasLabels && !isCreatingLabel;
  const hasActiveLabel = localLabels?.some(
    (label) => label?.rowId === activeLabelId,
  );

  return (
    <div className="flex flex-col">
      <div className="mb-1 flex h-10 items-center justify-between">
        <h2 className="ml-2 flex items-center gap-2 font-medium text-base-700 text-sm lg:ml-0 dark:text-base-300">
          Project Labels
        </h2>

        <Tooltip
          positioning={{ placement: "left" }}
          tooltip="Create new label"
          trigger={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Create new label"
              className={cn("mr-2 hidden size-7", !isMember && "inline-flex")}
              onClick={handleCreateNewLabel}
              disabled={activeLabelId !== null}
            >
              <PlusIcon />
            </Button>
          }
        />
      </div>

      {isCreatingLabel && (
        <LabelForm
          label={{
            rowId: "pending",
            name: "",
            color: "#09b8b5",
          }}
          isActive={true}
          onSetActive={handleSetActiveLabel}
          hasActiveLabel={hasActiveLabel}
          setLocalLabels={setLocalLabels}
        />
      )}

      {hasLabels ? (
        <div className="flex flex-col divide-y border-y">
          {localLabels.map((label) => (
            <LabelForm
              key={label.rowId}
              label={label}
              isActive={activeLabelId === label.rowId}
              onSetActive={handleSetActiveLabel}
              hasActiveLabel={hasActiveLabel || activeLabelId === "pending"}
              setLocalLabels={setLocalLabels}
            />
          ))}
        </div>
      ) : showEmptyState ? (
        <div className="ml-2 flex items-center text-base-500 text-sm lg:ml-0">
          No project labels
        </div>
      ) : null}
    </div>
  );
};

export default ProjectLabelsForm;
