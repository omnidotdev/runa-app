import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { CalendarIcon, TagIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";

import { PriorityIcon } from "@/components/tasks";
import { AvatarFallback, AvatarRoot } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import signIn from "@/lib/auth/signIn";
import { BASE_URL } from "@/lib/config/env.config";
import { cn } from "@/lib/utils";
import DemoBoardItem from "./DemoBoardItem";
import { demoColumns, initialDemoTasks } from "./demoBoardData";

import type { DropResult } from "@hello-pangea/dnd";
import type { DemoTask } from "./demoBoardData";

/**
 * Demo board for users to try the app.
 */
const DemoBoard = () => {
  const [tasks, setTasks] = useState<DemoTask[]>(initialDemoTasks);
  const [selectedTask, setSelectedTask] = useState<DemoTask | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // dropped outside a droppable area
    if (!destination) return;

    // dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    setTasks((prev) => {
      // find the task being moved
      const taskToMove = prev.find((t) => t.rowId === draggableId);
      if (!taskToMove) return prev;

      // remove task from the list
      const withoutTask = prev.filter((t) => t.rowId !== draggableId);

      // update the task's column if it changed
      const updatedTask: DemoTask = {
        ...taskToMove,
        columnId: destination.droppableId,
      };

      // get tasks in the destination column (without the moved task)
      const destColumnTasks = withoutTask.filter(
        (t) => t.columnId === destination.droppableId,
      );

      // insert at the destination index
      destColumnTasks.splice(destination.index, 0, updatedTask);

      // rebuild the full task list with updated column indices
      const otherTasks = withoutTask.filter(
        (t) => t.columnId !== destination.droppableId,
      );

      const reindexedDestTasks = destColumnTasks.map((t, idx) => ({
        ...t,
        columnIndex: idx,
      }));

      // reindex the source column if it's different
      if (source.droppableId !== destination.droppableId) {
        const sourceColumnTasks = otherTasks
          .filter((t) => t.columnId === source.droppableId)
          .map((t, idx) => ({ ...t, columnIndex: idx }));

        const remainingTasks = otherTasks.filter(
          (t) => t.columnId !== source.droppableId,
        );

        return [...remainingTasks, ...sourceColumnTasks, ...reindexedDestTasks];
      }

      return [...otherTasks, ...reindexedDestTasks];
    });
  };

  const getColumnTasks = (columnId: string) =>
    tasks
      .filter((t) => t.columnId === columnId)
      .sort((a, b) => a.columnIndex - b.columnIndex);

  return (
    <div className="overflow-hidden rounded-2xl border border-primary-500/10 bg-white/95 dark:border-primary-500/10 dark:bg-base-900/95">
      <ScrollContainer
        className="custom-scrollbar overflow-x-auto bg-primary-100/30 dark:bg-primary-950/15"
        ignoreElements="[data-rfd-draggable-id]"
      >
        <div className="min-w-fit p-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-3">
              {demoColumns.map((column) => {
                const columnTasks = getColumnTasks(column.rowId);

                return (
                  <div key={column.rowId} className="flex w-72 flex-col gap-2">
                    {/* column header */}
                    <div className="mb-1 flex items-center gap-2 rounded-lg py-2">
                      <span>{column.emoji}</span>
                      <h3 className="font-semibold text-base-800 text-sm dark:text-base-100">
                        {column.title}
                      </h3>
                      <span className="flex size-6 items-center justify-center rounded-full font-semibold text-foreground text-xs tabular-nums">
                        {columnTasks.length}
                      </span>
                    </div>

                    {/* droppable column */}
                    <Droppable droppableId={column.rowId}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            "flex h-80 flex-col overflow-y-auto rounded-xl p-2 transition-colors",
                            snapshot.isDraggingOver &&
                              "bg-primary-200/40 dark:bg-primary-900/40",
                          )}
                        >
                          {columnTasks.map((task, index) => (
                            <DemoBoardItem
                              key={task.rowId}
                              task={task}
                              index={index}
                              onSelect={() => setSelectedTask(task)}
                            />
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </div>
      </ScrollContainer>

      {/* task detail modal */}
      <DialogRoot
        open={!!selectedTask}
        onOpenChange={({ open }) => !open && setSelectedTask(null)}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent className="max-w-md">
            <DialogCloseTrigger />
            {selectedTask && (
              <>
                <div className="flex items-center gap-2">
                  {selectedTask.priority && (
                    <PriorityIcon priority={selectedTask.priority} />
                  )}
                  <Badge
                    variant="outline"
                    className="border-primary-500/20 text-primary-600 text-xs capitalize dark:text-primary-400"
                  >
                    {demoColumns.find((c) => c.rowId === selectedTask.columnId)
                      ?.title ?? "Task"}
                  </Badge>
                </div>

                <DialogTitle className="mt-2">
                  {selectedTask.content}
                </DialogTitle>

                <DialogDescription className="text-base-500">
                  This is a demo task. Sign up to create and manage your own
                  tasks with full editing capabilities.
                </DialogDescription>

                <div className="mt-4 space-y-3">
                  {/* assignees */}
                  <div className="flex items-center gap-3">
                    <UserIcon className="size-4 text-base-400" />
                    {selectedTask.assignees.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                          {selectedTask.assignees.map((assignee) => (
                            <AvatarRoot
                              key={assignee.name}
                              className="size-6 border-2 border-background"
                            >
                              <AvatarFallback className="bg-primary-100 text-primary-700 text-xs dark:bg-primary-900 dark:text-primary-300">
                                {assignee.name.charAt(0)}
                              </AvatarFallback>
                            </AvatarRoot>
                          ))}
                        </div>
                        <span className="text-sm">
                          {selectedTask.assignees.map((a) => a.name).join(", ")}
                        </span>
                      </div>
                    ) : (
                      <span className="text-base-400 text-sm">Unassigned</span>
                    )}
                  </div>

                  {/* labels */}
                  <div className="flex items-center gap-3">
                    <TagIcon className="size-4 text-base-400" />
                    {selectedTask.labels.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {selectedTask.labels.map((label) => (
                          <Badge
                            key={label.name}
                            variant="outline"
                            className="border-0 px-2 py-0.5 text-xs"
                            style={{
                              backgroundColor: `${label.color}20`,
                              color: label.color,
                            }}
                          >
                            {label.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-base-400 text-sm">No labels</span>
                    )}
                  </div>

                  {/* due date placeholder */}
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="size-4 text-base-400" />
                    <span className="text-base-400 text-sm">No due date</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={() => signIn({ redirectUrl: BASE_URL })}
                    className="w-full bg-primary-500 text-base-950 hover:bg-primary-400"
                  >
                    Sign up to edit tasks
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </div>
  );
};

export default DemoBoard;
