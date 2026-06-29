import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@omnidotdev/thornberry/avatar";
import { ImagePlus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  useProjectQuery,
  useProjectsQuery,
  useUpdateProjectMutation,
} from "@/generated/graphql";
import {
  IMAGE_MIME_TYPES,
  MAX_PROJECT_IMAGE_BYTES,
  kindFromMimeType,
  validateFile,
} from "@/lib/media/mediaConfig";
import { uploadProjectImage } from "@/lib/media/uploadProjectImage";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";

interface Props {
  /** Project rowId whose avatar is being edited */
  projectId: string;
  /** Project name, used for the fallback initial */
  name: string;
  /** Current avatar URL, if any */
  image?: string | null;
  /** Whether the current user may edit the avatar */
  disabled?: boolean;
}

/**
 * Project avatar editor. Uploads an image to object storage and persists the
 * resulting URL to `project.image`, saving immediately rather than waiting for
 * the details form submit.
 */
const ProjectAvatar = ({ projectId, name, image, disabled }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isBusy, setIsBusy] = useState(false);

  const { mutateAsync: updateProject } = useUpdateProjectMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useProjectQuery),
        getQueryKeyPrefix(useProjectsQuery),
      ],
    },
  });

  const persist = (nextImage: string | null) =>
    updateProject({ rowId: projectId, patch: { image: nextImage } });

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
      const { url } = await uploadProjectImage(file, projectId);
      await persist(url);
      toast.success("Avatar updated");
    } catch {
      toast.error("Could not upload avatar");
    } finally {
      setIsBusy(false);
    }
  };

  const onRemove = async () => {
    setIsBusy(true);
    try {
      await persist(null);
      toast.success("Avatar removed");
    } catch {
      toast.error("Could not remove avatar");
    } finally {
      setIsBusy(false);
    }
  };

  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex items-center gap-4">
      <AvatarRoot size="xl" className="rounded-xl border">
        {image ? <AvatarImage src={image} alt="" /> : null}
        <AvatarFallback className="rounded-xl font-semibold text-base-500 text-lg">
          {initial}
        </AvatarFallback>
      </AvatarRoot>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={disabled || isBusy}
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus className="size-4" />
            {image ? "Change" : "Upload"}
          </Button>

          {image && (
            <Button
              size="sm"
              variant="ghost"
              disabled={disabled || isBusy}
              onClick={onRemove}
            >
              <Trash2 className="size-4" />
              Remove
            </Button>
          )}
        </div>

        <p className="text-base-500 text-xs">
          PNG, JPG, WebP, GIF or AVIF, up to{" "}
          {Math.round(MAX_PROJECT_IMAGE_BYTES / (1024 * 1024))}MB.
        </p>
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

export default ProjectAvatar;
