import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $insertNodes,
  COMMAND_PRIORITY_HIGH,
  DROP_COMMAND,
  PASTE_COMMAND,
} from "lexical";
import { useEffect } from "react";
import { toast } from "sonner";

import { IMAGE_MIME_TYPES } from "@/lib/media/mediaConfig";
import { uploadAttachment } from "@/lib/media/uploadAttachment";
import { $createImageNode } from "./nodes/ImageNode";

interface Props {
  taskId: string;
  postId?: string;
}

const imageFilesFrom = (data: DataTransfer | null): File[] =>
  data
    ? Array.from(data.files).filter((file) => IMAGE_MIME_TYPES.has(file.type))
    : [];

/**
 * Uploads images pasted or dropped into the editor and inserts them inline.
 * Non-image pastes/drops fall through to Lexical's default handling.
 */
const ImagePastePlugin = ({ taskId, postId }: Props) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const handleFiles = async (files: File[]) => {
      for (const file of files) {
        try {
          const record = await uploadAttachment(file, taskId, postId);
          editor.update(() => {
            $insertNodes([
              $createImageNode({ src: record.url, altText: record.filename }),
            ]);
          });
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Image upload failed",
          );
        }
      }
    };

    const removePaste = editor.registerCommand(
      PASTE_COMMAND,
      (event: ClipboardEvent) => {
        const files = imageFilesFrom(event.clipboardData);
        if (!files.length) return false;
        event.preventDefault();
        void handleFiles(files);
        return true;
      },
      COMMAND_PRIORITY_HIGH,
    );

    const removeDrop = editor.registerCommand(
      DROP_COMMAND,
      (event: DragEvent) => {
        const files = imageFilesFrom(event.dataTransfer);
        if (!files.length) return false;
        event.preventDefault();
        void handleFiles(files);
        return true;
      },
      COMMAND_PRIORITY_HIGH,
    );

    return () => {
      removePaste();
      removeDrop();
    };
  }, [editor, taskId, postId]);

  return null;
};

export default ImagePastePlugin;
