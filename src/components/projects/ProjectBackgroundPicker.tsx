import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { BanIcon, CheckIcon } from "lucide-react";

import {
  useProjectQuery,
  useProjectsQuery,
  useProjectsSidebarQuery,
  useUpdateProjectMutation,
} from "@/generated/graphql";
import { backgroundPresets } from "@/lib/constants/backgrounds";
import projectOptions from "@/lib/options/project.options";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { cn } from "@/lib/utils";

import type { ProjectBackground } from "@/lib/constants/backgrounds";

interface Props {
  /** When true, the picker is read-only (insufficient permissions). */
  disabled?: boolean;
}

/**
 * Board background selector: a neutral "None" default plus curated solid and
 * gradient presets. Saves immediately, mirroring ProjectColorPicker. Image
 * backgrounds (uploads/gallery) arrive in a later phase.
 */
const ProjectBackgroundPicker = ({ disabled }: Props) => {
  const { projectId } = useLoaderData({
    from: "/_app/workspaces/$workspaceSlug/projects/$projectSlug/settings",
  });

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const { mutate: updateProject } = useUpdateProjectMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useProjectQuery),
        getQueryKeyPrefix(useProjectsQuery),
        getQueryKeyPrefix(useProjectsSidebarQuery),
      ],
    },
  });

  const current = project?.background as ProjectBackground | null | undefined;
  const activeToken =
    current && (current.kind === "solid" || current.kind === "gradient")
      ? current.token
      : null;

  const save = (background: ProjectBackground | null) => {
    if (disabled) return;
    updateProject({ rowId: projectId, patch: { background } });
  };

  const swatchBase =
    "relative flex size-9 items-center justify-center rounded-md border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-default";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        aria-label="No background"
        aria-pressed={!activeToken}
        disabled={disabled}
        onClick={() => save(null)}
        className={cn(
          swatchBase,
          "bg-muted/40 text-muted-foreground hover:border-primary",
          !activeToken && "border-2 border-primary",
        )}
      >
        {!activeToken ? <CheckIcon size={14} /> : <BanIcon size={14} />}
      </button>

      {backgroundPresets.map((preset) => {
        const isActive = activeToken === preset.id;

        return (
          <button
            key={preset.id}
            type="button"
            aria-label={preset.label}
            aria-pressed={isActive}
            disabled={disabled}
            onClick={() => save({ kind: preset.kind, token: preset.id })}
            style={{ background: preset.css }}
            className={cn(
              swatchBase,
              "hover:border-primary",
              isActive ? "border-2 border-primary" : "border-border",
            )}
          >
            {isActive ? (
              <CheckIcon size={14} className="text-foreground drop-shadow" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
};

export default ProjectBackgroundPicker;
