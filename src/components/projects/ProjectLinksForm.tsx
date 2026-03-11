import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { GripVerticalIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Favicon, Tooltip } from "@/components/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCreateProjectLinkMutation,
  useDeleteProjectLinkMutation,
  useProjectQuery,
  useUpdateProjectLinkMutation,
} from "@/generated/graphql";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import projectOptions from "@/lib/options/project.options";
import { Role } from "@/lib/permissions";
import getDomainLabel from "@/lib/util/getDomainLabel";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";

const MAX_LINKS = 10;

const ProjectLinksForm = () => {
  const { projectId, organizationId } = useLoaderData({
    from: "/_app/workspaces/$workspaceSlug/projects/$projectSlug/settings",
  });

  const role = useCurrentUserRole(organizationId);
  const isMember = role === Role.Member;

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const existingLinks = [...(project?.projectLinks?.nodes ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  const [newUrl, setNewUrl] = useState("");

  const invalidates = [getQueryKeyPrefix(useProjectQuery)];

  const { mutate: createLink } = useCreateProjectLinkMutation({
    meta: { invalidates },
    onSuccess: () => {
      setNewUrl("");
      toast.success("Link added");
    },
    onError: (error: Error) => {
      toast.error(
        error.message.includes("unique")
          ? "Link already exists"
          : "Failed to add link",
      );
    },
  });

  const { mutate: updateLink } = useUpdateProjectLinkMutation({
    meta: { invalidates },
  });

  const { mutate: deleteLink } = useDeleteProjectLinkMutation({
    meta: { invalidates },
    onSuccess: () => toast.success("Link removed"),
  });

  const handleAddLink = () => {
    if (!newUrl.trim()) return;

    try {
      new URL(newUrl.trim());
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    createLink({
      projectLink: {
        projectId,
        url: newUrl.trim(),
        title: getDomainLabel(newUrl.trim()),
        order: existingLinks.length,
      },
    });
  };

  const handleDelete = (rowId: string) => {
    deleteLink({ rowId });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const link = existingLinks[index];
    const swapLink = existingLinks[index - 1];
    updateLink({ rowId: link.rowId, patch: { order: index - 1 } });
    updateLink({ rowId: swapLink.rowId, patch: { order: index } });
  };
  return (
    <div className="flex flex-col">
      <div className="mb-1 flex h-10 items-center justify-between">
        <h2 className="ml-2 font-medium text-base-700 text-sm lg:ml-0 dark:text-base-300">
          Links
        </h2>
      </div>

      <div className="flex flex-col divide-y border-y">
        {existingLinks.map((link, index) => (
          <div key={link.rowId} className="flex h-10 w-full items-center gap-2">
            <div className="flex items-center gap-1 pl-2 lg:pl-0">
              {!isMember && existingLinks.length > 1 && (
                <div className="flex flex-col">
                  <button
                    type="button"
                    className="text-base-400 hover:text-foreground disabled:opacity-30"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    aria-label="Move up"
                  >
                    <GripVerticalIcon className="size-3.5" />
                  </button>
                </div>
              )}
              <Favicon url={link.url} />
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="truncate text-sm">
                {link.title || getDomainLabel(link.url)}
              </span>
              <span className="truncate text-base-400 text-xs">{link.url}</span>
            </div>

            {!isMember && (
              <Tooltip
                tooltip="Remove link"
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2 size-7 text-base-400 hover:text-red-500"
                    onClick={() => handleDelete(link.rowId)}
                  >
                    <Trash2Icon className="size-3.5" />
                  </Button>
                }
              />
            )}
          </div>
        ))}

        {!isMember && existingLinks.length < MAX_LINKS && (
          <div className="flex h-10 w-full items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center pl-2 lg:pl-0">
              <Input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddLink();
                  }
                }}
                placeholder="https://..."
                className="h-8 border-0 shadow-none focus-visible:ring-offset-0"
                autoComplete="off"
              />
            </div>
            <Tooltip
              tooltip="Add link"
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2 size-7"
                  onClick={handleAddLink}
                  disabled={!newUrl.trim()}
                >
                  <PlusIcon className="size-3.5" />
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectLinksForm;
