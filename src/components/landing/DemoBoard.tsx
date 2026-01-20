import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import {
  CalendarIcon,
  Grid2X2Icon,
  ListIcon,
  MoonIcon,
  SunIcon,
  TagIcon,
  UserIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Shortcut, Tooltip } from "@/components/core";
import { PriorityIcon } from "@/components/tasks";
import { AvatarFallback, AvatarRoot } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CollapsibleContent,
  CollapsibleRoot,
} from "@/components/ui/collapsible";
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
import { useTheme } from "@/providers/ThemeProvider";
import DemoBoardItem from "./DemoBoardItem";
import DemoListItem from "./DemoListItem";
import { demoColumns, initialDemoTasks } from "./demoBoardData";

import type { DragStart, DropResult } from "@hello-pangea/dnd";
import type { DemoTask } from "./demoBoardData";

const DEMO_PROJECT_PREFIX = "DEMO";

/** Demo column width (320px) + gap (12px) */
const COLUMN_WIDTH = 320;
const COLUMN_GAP = 12;
const CONTAINER_PADDING = 32; // p-4 = 16px * 2

/**
 * Demo board for users to try the app.
 */
const DemoBoard = () => {
  const { theme, setTheme } = useTheme();
  const [tasks, setTasks] = useState<DemoTask[]>(initialDemoTasks);
  const [selectedTask, setSelectedTask] = useState<DemoTask | null>(null);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [_isDragging, setIsDragging] = useState(false);
  const [columnOpenStates, setColumnOpenStates] = useState(
    demoColumns.map(() => true),
  );

  const toggleViewMode = useCallback(
    () => setViewMode((prev) => (prev === "board" ? "list" : "board")),
    [],
  );

  const toggleTheme = useCallback(
    () => setTheme(theme === "dark" ? "light" : "dark"),
    [theme, setTheme],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "v") {
        toggleViewMode();
      } else if (e.key === "t") {
        toggleTheme();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleViewMode, toggleTheme]);

  const onDragStart = (_start: DragStart) => {
    setIsDragging(true);
  };

  const onDragEnd = (result: DropResult) => {
    setIsDragging(false);
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

  const getDisplayId = (task: DemoTask) =>
    `${DEMO_PROJECT_PREFIX}-${task.number}`;

  // Calculate exact width for 3 columns
  const boardWidth =
    demoColumns.length * COLUMN_WIDTH +
    (demoColumns.length - 1) * COLUMN_GAP +
    CONTAINER_PADDING;

  return (
    <div
      className="overflow-hidden rounded-2xl bg-white/95 ring-1 ring-primary-500/10 dark:bg-base-900/95"
      style={{ width: boardWidth }}
    >
      {/* Toolbar header */}
      <div className="flex items-center justify-end gap-1 border-primary-500/10 border-b px-4 py-2">
        <Tooltip
          positioning={{ placement: "bottom" }}
          tooltip={theme === "dark" ? "Light Mode" : "Dark Mode"}
          shortcut="T"
          trigger={
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="gap-2 text-base-600 text-xs dark:text-base-400"
            >
              {theme === "dark" ? (
                <SunIcon className="size-4" />
              ) : (
                <MoonIcon className="size-4" />
              )}
              <Shortcut>T</Shortcut>
            </Button>
          }
        />
        <Tooltip
          positioning={{ placement: "bottom" }}
          tooltip={viewMode === "list" ? "Board View" : "List View"}
          shortcut="V"
          trigger={
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleViewMode}
              className="gap-2 text-base-600 text-xs dark:text-base-400"
            >
              {viewMode === "list" ? (
                <>
                  <Grid2X2Icon className="size-4" />
                  Board View
                </>
              ) : (
                <>
                  <ListIcon className="size-4" />
                  List View
                </>
              )}
              <Shortcut>V</Shortcut>
            </Button>
          }
        />
      </div>

      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        {viewMode === "board" ? (
          <div
            className="bg-primary-100/30 p-4 dark:bg-primary-950/15"
            style={{ width: boardWidth }}
          >
            <div className="flex gap-3">
              {demoColumns.map((column) => {
                const columnTasks = getColumnTasks(column.rowId);

                return (
                  <div
                    key={column.rowId}
                    className="relative flex w-[320px] flex-col gap-2"
                  >
                    {/* column header */}
                    <div className="mb-1 flex items-center gap-2 rounded-lg py-2">
                      <span>{column.emoji}</span>
                      <h3 className="font-semibold text-base-800 text-sm dark:text-base-100">
                        {column.title}
                      </h3>
                      <span className="flex size-7 items-center justify-center rounded-full font-semibold text-foreground text-xs tabular-nums">
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
                            "flex flex-1 flex-col rounded-xl",
                            "h-80 overflow-y-auto transition-colors",
                            snapshot.isDraggingOver &&
                              "bg-primary-100/40 dark:bg-primary-950/40",
                          )}
                        >
                          {columnTasks.map((task, index) => (
                            <DemoBoardItem
                              key={task.rowId}
                              task={task}
                              index={index}
                              displayId={getDisplayId(task)}
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
          </div>
        ) : (
          <div className="bg-primary-100/30 p-4 dark:bg-primary-950/15">
            {demoColumns.map((column, index) => {
              const columnTasks = getColumnTasks(column.rowId);

              return (
                <CollapsibleRoot
                  key={column.rowId}
                  className="mb-4 rounded-lg border bg-background last:mb-0"
                  open={columnOpenStates[index]}
                  onOpenChange={({ open }) => {
                    setColumnOpenStates((prev) => {
                      const newStates = [...prev];
                      newStates[index] = open;
                      return newStates;
                    });
                  }}
                >
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-t-lg px-3 py-2 hover:bg-base-50 dark:hover:bg-base-800"
                    onClick={() =>
                      setColumnOpenStates((prev) => {
                        const newStates = [...prev];
                        newStates[index] = !newStates[index];
                        return newStates;
                      })
                    }
                  >
                    <span>{column.emoji}</span>
                    <h3 className="font-semibold text-base-800 text-sm dark:text-base-100">
                      {column.title}
                    </h3>
                    <span className="flex size-6 items-center justify-center rounded-full font-semibold text-foreground text-xs tabular-nums">
                      {columnTasks.length}
                    </span>
                  </button>

                  <CollapsibleContent className="rounded-b-lg p-0">
                    <div className="border-t transition-opacity ease-in-out" />
                    <Droppable droppableId={column.rowId}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            "divide-y divide-base-200 overflow-hidden dark:divide-base-700",
                            snapshot.isDraggingOver &&
                              "bg-primary-100/40 dark:bg-primary-950/30",
                          )}
                        >
                          {columnTasks.length === 0 ? (
                            <p
                              className={cn(
                                "p-2 pl-2 text-muted-foreground text-xs",
                                snapshot.isDraggingOver && "hidden",
                              )}
                            >
                              No tasks
                            </p>
                          ) : (
                            columnTasks.map((task, index) => (
                              <DemoListItem
                                key={task.rowId}
                                task={task}
                                index={index}
                                displayId={getDisplayId(task)}
                                onSelect={() => setSelectedTask(task)}
                              />
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </CollapsibleContent>
                </CollapsibleRoot>
              );
            })}
          </div>
        )}
      </DragDropContext>

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
                  <span className="font-medium font-mono text-base-400 text-xs">
                    {getDisplayId(selectedTask)}
                  </span>
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
                              <AvatarFallback
                                className="text-xs"
                                style={{
                                  backgroundColor: `${assignee.color}20`,
                                  color: assignee.color,
                                }}
                              >
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
