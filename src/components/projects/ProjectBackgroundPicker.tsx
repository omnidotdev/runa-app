import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { BanIcon, CheckIcon, ImagePlus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  useProjectQuery,
  useProjectsQuery,
  useProjectsSidebarQuery,
  useUpdateProjectMutation,
} from "@/generated/graphql";
import { API_BASE_URL } from "@/lib/config/env.config";
import {
  backgroundPresets,
  resolveBackgroundStyle,
} from "@/lib/constants/backgrounds";
import {
  IMAGE_MIME_TYPES,
  MAX_PROJECT_IMAGE_BYTES,
  kindFromMimeType,
  validateFile,
} from "@/lib/media/mediaConfig";
import { uploadProjectBackground } from "@/lib/media/uploadProjectBackground";
import projectOptions from "@/lib/options/project.options";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { cn } from "@/lib/utils";

import type { ProjectBackground } from "@/lib/constants/backgrounds";

interface Props {
  /** When true, the picker is read-only (insufficient permissions). */
  disabled?: boolean;
}

/**
 * Board background selector: a neutral "None" default, curated solid/gradient
 * presets, and an uploaded image. Saves immediately, mirroring
 * ProjectColorPicker / ProjectAvatar.
 */
const ProjectBackgroundPicker = ({ disabled }: Props) => {
  const { projectId } = useLoaderData({
    from: "/_app/workspaces/$workspaceSlug/projects/$projectSlug/settings",
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [isBusy, setIsBusy] = useState(false);

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
  const isNeutral = !current;
  const isImage = current?.kind === "image";

  const save = (background: ProjectBackground | null) => {
    if (disabled) return;
    updateProject({ rowId: projectId, patch: { background } });
  };

  const onSelectFile = async (file: File) => {
    const error = validateFile(file, MAX_PROJECT_IMAGE_BYTES);
    if (error) {
      toast.error(error);
      return;
    }
    if (kindFromMimeType(file.type) !== "image") {
      toast.error("Please choose an image file");
      return;
    }

    setIsBusy(true);
    try {
      const { assetId } = await uploadProjectBackground(file, projectId);
      save({ kind: "image", assetId });
      toast.success("Background updated");
    } catch {
      toast.error("Could not upload background");
    } finally {
      setIsBusy(false);
    }
  };

  const swatchBase =
    "relative flex size-9 items-center justify-center overflow-hidden rounded-md border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-default";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-label="No background"
          aria-pressed={isNeutral}
          disabled={disabled || isBusy}
          onClick={() => save(null)}
          className={cn(
            swatchBase,
            "bg-muted/40 text-muted-foreground hover:border-primary",
            isNeutral && "border-2 border-primary",
          )}
        >
          {isNeutral ? <CheckIcon size={14} /> : <BanIcon size={14} />}
        </button>

        {backgroundPresets.map((preset) => {
          const isActive = activeToken === preset.id;

          return (
            <button
              key={preset.id}
              type="button"
              aria-label={preset.label}
              aria-pressed={isActive}
              disabled={disabled || isBusy}
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

        {isImage ? (
          <div
            role="img"
            aria-label="Uploaded background"
            style={resolveBackgroundStyle(current, {
              assetBaseUrl: API_BASE_URL,
            })}
            className={cn(swatchBase, "border-2 border-primary")}
          >
            <CheckIcon size={14} className="text-white drop-shadow" />
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={disabled || isBusy}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="size-4" />
          {isImage ? "Change image" : "Upload image"}
        </Button>

        {isImage ? (
          <Button
            size="sm"
            variant="ghost"
            disabled={disabled || isBusy}
            onClick={() => save(null)}
          >
            <Trash2 className="size-4" />
            Remove
          </Button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={[...IMAGE_MIME_TYPES].join(",")}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onSelectFile(file);
          event.target.value = "";
        }}
      />
    </div>
  );
};

export default ProjectBackgroundPicker;
