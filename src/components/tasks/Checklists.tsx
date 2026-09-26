import { CardContent, CardHeader, CardRoot } from "@omnidotdev/thornberry/card";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import {
  ArrowUpRightIcon,
  CheckSquareIcon,
  LinkIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SquareIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  useConvertChecklistItemToTaskMutation,
  useCreateChecklistItemMutation,
  useCreateChecklistMutation,
  useDeleteChecklistItemMutation,
  useDeleteChecklistMutation,
  useProjectQuery,
  useTasksQuery,
  useUpdateChecklistItemMutation,
  useUpdateChecklistMutation,
} from "@/generated/graphql";
import taskOptions from "@/lib/options/task.options";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { faviconUrl, isHttpUrl, shortenUrl } from "@/lib/util/linkChip";
import nextFractionalIndex from "@/lib/util/nextFractionalIndex";

import type { TaskQuery } from "@/generated/graphql";

type PendingAction =
  | { kind: "deleteChecklist"; id: string; label: string }
  | { kind: "deleteItem"; id: string; label: string }
  | { kind: "convertItem"; id: string; label: string };

/**
 * Checklists section for the task detail page. Renders each named checklist with a
 * progress count, toggleable items, inline add, rename, delete, and a convert-to-task
 * action. Destructive/irreversible actions (delete, convert) are guarded by a
 * confirmation; permissions are enforced server-side regardless
 */
const Checklists = () => {
  const { taskId } = useLoaderData({
    from: "/_app/@{$workspaceSlug}/$projectSlug/$taskId",
  });

  const queryClient = useQueryClient();

  const { data: task } = useSuspenseQuery({
    ...taskOptions({ rowId: taskId }),
    select: (data) => data?.task,
  });

  const taskQueryKey = taskOptions({ rowId: taskId }).queryKey;

  const checklists = task?.checklists?.nodes ?? [];

  const [newItemContent, setNewItemContent] = useState<Record<string, string>>(
    {},
  );
  const [pending, setPending] = useState<PendingAction | null>(null);

  const { mutate: createChecklist } = useCreateChecklistMutation({
    meta: { invalidates: [taskQueryKey] },
  });
  const { mutate: updateChecklist } = useUpdateChecklistMutation({
    meta: { invalidates: [taskQueryKey] },
  });
  const { mutate: deleteChecklist } = useDeleteChecklistMutation({
    meta: { invalidates: [taskQueryKey] },
  });
  const { mutate: createChecklistItem } = useCreateChecklistItemMutation({
    meta: { invalidates: [taskQueryKey] },
  });
  const { mutate: deleteChecklistItem } = useDeleteChecklistItemMutation({
    meta: { invalidates: [taskQueryKey] },
  });

  const { mutate: updateChecklistItem } = useUpdateChecklistItemMutation({
    meta: { invalidates: [taskQueryKey] },
    // Optimistically flip the checkbox so toggling feels instant
    onMutate: (variables) => {
      queryClient.setQueryData<TaskQuery>(taskQueryKey, (old) => {
        if (!old?.task) return old;
        return {
          ...old,
          task: {
            ...old.task,
            checklists: {
              ...old.task.checklists,
              nodes: old.task.checklists.nodes.map((checklist) => ({
                ...checklist,
                checklistItems: {
                  ...checklist.checklistItems,
                  nodes: checklist.checklistItems.nodes.map((item) =>
                    item.rowId === variables.input.rowId
                      ? { ...item, isDone: !!variables.input.patch.isDone }
                      : item,
                  ),
                },
              })),
            },
          },
        };
      });
    },
  });

  const { mutate: convertChecklistItemToTask } =
    useConvertChecklistItemToTaskMutation({
      meta: {
        invalidates: [
          taskQueryKey,
          getQueryKeyPrefix(useTasksQuery),
          getQueryKeyPrefix(useProjectQuery),
        ],
      },
      onSuccess: () => toast.success("Checklist item converted to a task"),
      onError: () =>
        toast.error("Could not convert the item. Please try again."),
    });

  const addChecklist = () =>
    createChecklist({
      input: {
        checklist: {
          taskId,
          title: "Checklist",
          index: nextFractionalIndex(checklists),
        },
      },
    });

  const renameChecklist = (rowId: string, title: string) =>
    updateChecklist({ input: { rowId, patch: { title } } });

  const addItem = (
    checklistId: string,
    items: ReadonlyArray<{ index: string; content: string }>,
  ) => {
    const content = (newItemContent[checklistId] ?? "").trim();
    if (!content) return;

    // Skip exact duplicates (guards accidental double-submit and re-adds of the
    // same link/text), rather than silently creating another identical item
    const isDuplicate = items.some(
      (item) => item.content.trim().toLowerCase() === content.toLowerCase(),
    );
    if (isDuplicate) {
      toast.info("That item is already on the checklist");
      setNewItemContent((prev) => ({ ...prev, [checklistId]: "" }));
      return;
    }

    createChecklistItem({
      input: {
        checklistItem: {
          checklistId,
          content,
          index: nextFractionalIndex(items),
        },
      },
    });
    setNewItemContent((prev) => ({ ...prev, [checklistId]: "" }));
  };

  const runPending = () => {
    if (!pending) return;
    if (pending.kind === "deleteChecklist") {
      deleteChecklist({ rowId: pending.id });
    } else if (pending.kind === "deleteItem") {
      deleteChecklistItem({ rowId: pending.id });
    } else {
      convertChecklistItemToTask({ input: { checklistItemId: pending.id } });
    }
    setPending(null);
  };

  return (
    <>
      <CardRoot className="p-0 shadow-none">
        <CardHeader className="flex h-10 flex-row items-center gap-2 rounded-t-xl border-b bg-base-50 px-3 dark:bg-base-800">
          <h3 className="font-medium text-base-900 text-sm dark:text-base-100">
            Checklists
          </h3>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 p-3">
          {checklists.map((checklist) => {
            const items = checklist.checklistItems?.nodes ?? [];
            const done = items.filter((item) => item.isDone).length;

            return (
              <div key={checklist.rowId} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Input
                    key={checklist.rowId}
                    defaultValue={checklist.title}
                    aria-label="Checklist title"
                    className="h-8 border-transparent bg-transparent px-1 font-medium text-sm shadow-none hover:border-border focus:border-border"
                    onBlur={(e) => {
                      const next = e.target.value.trim();
                      if (next && next !== checklist.title) {
                        renameChecklist(checklist.rowId, next);
                      }
                    }}
                  />
                  <span className="shrink-0 text-base-500 text-xs tabular-nums dark:text-base-400">
                    {done}/{items.length}
                  </span>
                  <MenuRoot
                    positioning={{ strategy: "fixed", placement: "left" }}
                  >
                    <MenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-base-400"
                        aria-label="Checklist options"
                      >
                        <MoreHorizontalIcon />
                      </Button>
                    </MenuTrigger>
                    <MenuPositioner>
                      <MenuContent className="focus-within:outline-none">
                        <MenuItem
                          value="delete"
                          variant="destructive"
                          onClick={() =>
                            setPending({
                              kind: "deleteChecklist",
                              id: checklist.rowId,
                              label: checklist.title,
                            })
                          }
                        >
                          <Trash2Icon />
                          <span>Delete checklist</span>
                        </MenuItem>
                      </MenuContent>
                    </MenuPositioner>
                  </MenuRoot>
                </div>

                <div className="grid gap-0.5">
                  {items.map((item) => (
                    <div
                      key={item.rowId}
                      className="group flex items-center gap-2 rounded px-1 py-1 hover:bg-base-50 dark:hover:bg-base-800"
                    >
                      <button
                        type="button"
                        aria-label={
                          item.isDone ? "Mark incomplete" : "Mark complete"
                        }
                        className="shrink-0 text-base-500 dark:text-base-400"
                        onClick={() =>
                          updateChecklistItem({
                            input: {
                              rowId: item.rowId,
                              patch: { isDone: !item.isDone },
                            },
                          })
                        }
                      >
                        {item.isDone ? (
                          <CheckSquareIcon className="size-4 text-primary" />
                        ) : (
                          <SquareIcon className="size-4" />
                        )}
                      </button>
                      {isHttpUrl(item.content) ? (
                        <a
                          href={item.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={item.content}
                          className={
                            item.isDone
                              ? "flex min-w-0 flex-1 items-center gap-1.5 text-sm opacity-60"
                              : "flex min-w-0 flex-1 items-center gap-1.5 text-sm"
                          }
                        >
                          <LinkFavicon url={item.content} />
                          <span
                            className={
                              item.isDone
                                ? "truncate text-primary line-through"
                                : "truncate text-primary hover:underline"
                            }
                          >
                            {shortenUrl(item.content)}
                          </span>
                        </a>
                      ) : (
                        <span
                          className={
                            item.isDone
                              ? "flex-1 text-base-400 text-sm line-through dark:text-base-500"
                              : "flex-1 text-base-900 text-sm dark:text-base-100"
                          }
                        >
                          {item.content}
                        </span>
                      )}
                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <ItemActions
                          onConvert={() =>
                            setPending({
                              kind: "convertItem",
                              id: item.rowId,
                              label: item.content,
                            })
                          }
                          onDelete={() =>
                            setPending({
                              kind: "deleteItem",
                              id: item.rowId,
                              label: item.content,
                            })
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <PlusIcon className="size-4 shrink-0 text-base-400" />
                  <Input
                    value={newItemContent[checklist.rowId] ?? ""}
                    placeholder="Add an item..."
                    aria-label="Add checklist item"
                    className="h-8 text-sm"
                    onChange={(e) =>
                      setNewItemContent((prev) => ({
                        ...prev,
                        [checklist.rowId]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addItem(checklist.rowId, items);
                      }
                    }}
                  />
                </div>
              </div>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            className="self-start"
            onClick={addChecklist}
          >
            <PlusIcon />
            Add checklist
          </Button>
        </CardContent>
      </CardRoot>

      <ConfirmDialog
        open={!!pending}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
        title={
          pending?.kind === "convertItem"
            ? "Convert item to task?"
            : pending?.kind === "deleteChecklist"
              ? `Delete checklist "${pending.label}"?`
              : "Delete item?"
        }
        description={
          pending?.kind === "convertItem"
            ? `"${pending.label}" will be removed from the checklist and created as a new task. This cannot be undone.`
            : pending?.kind === "deleteChecklist"
              ? "This will delete the checklist and all of its items. This cannot be undone."
              : `"${pending?.label}" will be removed. This cannot be undone.`
        }
        confirmLabel={pending?.kind === "convertItem" ? "Convert" : "Delete"}
        destructive={pending?.kind !== "convertItem"}
        onConfirm={runPending}
      />
    </>
  );
};

/** Favicon for a link item, falling back to a generic link icon on load error. */
const LinkFavicon = ({ url }: { url: string }) => {
  const [failed, setFailed] = useState(false);
  const src = faviconUrl(url);

  if (!src || failed) {
    return <LinkIcon className="size-3.5 shrink-0 text-base-400" />;
  }

  return (
    <img
      src={src}
      alt=""
      width={14}
      height={14}
      className="size-3.5 shrink-0 rounded-sm"
      onError={() => setFailed(true)}
    />
  );
};

/** Per-item action buttons (convert to task, delete). */
const ItemActions = ({
  onConvert,
  onDelete,
}: {
  onConvert: () => void;
  onDelete: () => void;
}) => (
  <>
    <Button
      variant="ghost"
      size="icon"
      className="size-6 text-base-400"
      aria-label="Convert to task"
      onClick={onConvert}
    >
      <ArrowUpRightIcon />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      className="size-6 text-base-400"
      aria-label="Delete item"
      onClick={onDelete}
    >
      <Trash2Icon />
    </Button>
  </>
);

export default Checklists;
