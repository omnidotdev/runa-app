import { CardContent, CardHeader, CardRoot } from "@omnidotdev/thornberry/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { DownloadIcon, FileIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Image } from "@/components/core/Image";
import useTier from "@/lib/hooks/useTier";
import { formatFileSize, validateFile } from "@/lib/media/mediaConfig";
import {
  deleteAttachment,
  uploadAttachment,
} from "@/lib/media/uploadAttachment";
import taskAttachmentsOptions from "@/lib/options/taskAttachments.options";
import { getMaxAttachmentBytes } from "@/lib/types/tier";
import { cn } from "@/lib/utils";

interface AttachmentMetadata {
  thumbnailUrl?: string;
  lqip?: string;
}

interface Props {
  taskId: string;
  /** Workspace that owns the task, used to resolve the tier attachment cap */
  organizationId?: string;
  /** When false, the uploader and delete actions are hidden */
  editable?: boolean;
}

const AttachmentsSection = ({
  taskId,
  organizationId,
  editable = true,
}: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const tier = useTier(organizationId);
  const maxAttachmentBytes = getMaxAttachmentBytes(tier);

  const options = taskAttachmentsOptions({ taskId });
  const { data } = useQuery({
    ...options,
    select: (result) => result?.attachments?.nodes ?? [],
  });
  const attachments = data ?? [];

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: options.queryKey });

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (!list.length) return;

    setIsUploading(true);
    try {
      for (const file of list) {
        const advisory = validateFile(file, maxAttachmentBytes);
        if (advisory) {
          // A size rejection is a plan limit; offer an upgrade path. An empty
          // file is not, so keep that as a plain error.
          const isSizeLimit = file.size > 0;
          toast.error(`${file.name}: ${advisory}`, {
            action: isSizeLimit
              ? {
                  label: "Upgrade",
                  onClick: () => navigate({ to: "/pricing" }),
                }
              : undefined,
          });
          continue;
        }
        try {
          await uploadAttachment(file, taskId);
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : `Failed to upload ${file.name}`,
          );
        }
      }
      await invalidate();
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, filename: string) => {
    try {
      await deleteAttachment(id);
      await invalidate();
      toast.success(`Deleted ${filename}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    }
  };

  if (!editable && attachments.length === 0) return null;

  return (
    <CardRoot className="p-0 shadow-none">
      <CardHeader className="flex h-10 flex-row items-center justify-between rounded-t-xl border-b bg-base-50 px-3 dark:bg-base-800">
        <h3 className="font-medium text-base-900 text-sm dark:text-base-100">
          Attachments{attachments.length ? ` (${attachments.length})` : ""}
        </h3>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 p-3">
        {attachments.length > 0 && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {attachments.map((attachment) => {
              const metadata = (attachment?.metadata ??
                {}) as AttachmentMetadata;
              const id = attachment?.rowId as string;
              const filename = attachment?.filename ?? "file";

              return (
                <div
                  key={id}
                  className="group relative overflow-hidden rounded-lg border bg-base-50 dark:bg-base-900"
                >
                  {attachment?.kind === "image" ? (
                    <a href={attachment.url} target="_blank" rel="noreferrer">
                      <Image
                        src={attachment.url}
                        alt={filename}
                        lqip={metadata.lqip}
                        sizes="(min-width: 640px) 33vw, 50vw"
                        className="aspect-video w-full"
                      />
                    </a>
                  ) : attachment?.kind === "video" ? (
                    <video
                      src={attachment.url}
                      controls
                      className="aspect-video w-full bg-black object-contain"
                    >
                      <track kind="captions" />
                    </video>
                  ) : (
                    <a
                      href={attachment?.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex aspect-video w-full flex-col items-center justify-center gap-1 p-2 text-center"
                    >
                      <FileIcon className="size-6 text-base-500" />
                      <span className="line-clamp-2 w-full break-all text-base-700 text-xs dark:text-base-300">
                        {filename}
                      </span>
                    </a>
                  )}

                  <div className="flex items-center justify-between gap-1 border-t bg-base-100 px-2 py-1 dark:bg-base-800">
                    <span className="truncate text-base-500 text-xs">
                      {formatFileSize(attachment?.fileSize ?? 0)}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <a
                        href={attachment?.url}
                        download={filename}
                        className="rounded p-1 hover:bg-base-200 dark:hover:bg-base-700"
                        aria-label="Download"
                      >
                        <DownloadIcon className="size-3.5 text-base-500" />
                      </a>
                      {editable && (
                        <button
                          type="button"
                          onClick={() => handleDelete(id, filename)}
                          className="rounded p-1 hover:bg-base-200 dark:hover:bg-base-700"
                          aria-label="Delete"
                        >
                          <Trash2Icon className="size-3.5 text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {editable && (
          <>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                void uploadFiles(event.dataTransfer.files);
              }}
              className={cn(
                "flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-base-300 border-dashed p-4 text-sm transition-colors hover:bg-base-50 dark:border-base-700 dark:hover:bg-base-800",
                isDragging && "border-primary bg-primary/5",
              )}
            >
              <UploadIcon className="size-4 text-base-500" />
              <span className="text-base-600 dark:text-base-400">
                {isUploading
                  ? "Uploading..."
                  : "Drag files here or click to upload"}
              </span>
            </button>
            <input
              ref={inputRef}
              type="file"
              multiple
              hidden
              onChange={(event) => {
                if (event.target.files) void uploadFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </>
        )}
      </CardContent>
    </CardRoot>
  );
};

export default AttachmentsSection;
