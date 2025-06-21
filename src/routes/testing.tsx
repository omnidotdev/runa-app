import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useDebounceCallback, useIsClient } from "usehooks-ts";

import taskCollection from "@/lib/collections/task.collection";

import type { FormEvent } from "react";

const AUTHOR_ID = "13210276-6058-4eba-035a-1653479b44e3";
const PROJECT_ID = "1bc35e5b-7d30-4502-e54e-868d0797d42a";
const COLUMN_ID = "40ba7c62-b294-45e1-493e-d5f274178b8a";
const DESCRIPTION = "This is the task description";

const RouteComponent = () => {
  const isClient = useIsClient();

  const [newTaskContent, setNewTaskContent] = useState("");

  const { data: tasks } = useLiveQuery((q) =>
    q
      .from({ taskCollection })
      .orderBy({ "@createdAt": "asc" })
      .select("@rowId", "@content"),
  );

  const handleDeleteTask = (taskId: string) => taskCollection.delete(taskId);

  const handleUpdateContent = useDebounceCallback(
    (taskId: string, content: string) => {
      const updatingTask = tasks.find((task) => task.rowId === taskId);

      if (!updatingTask || !content.trim()) return;

      taskCollection.update(updatingTask.rowId, (draft) => {
        draft.content = content;
      });
    },
    500,
  );

  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();

    if (!newTaskContent.trim()) return;

    taskCollection.insert({
      // TODO: determine proper way to handle this. Needed for the collection `getKey` util, but isn't used in the `onInsert` mutation
      rowId: Math.round(Math.random() * 1000000).toString(),
      content: newTaskContent,
      description: DESCRIPTION,
      columnId: COLUMN_ID,
      projectId: PROJECT_ID,
      authorId: AUTHOR_ID,
    });

    setNewTaskContent("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      {isClient ? (
        <div className="flex flex-col items-start justify-center gap-2">
          <h1 className="mb-4">Tasks</h1>
          {tasks.map((task) => (
            <div
              key={task.rowId}
              className="flex w-full justify-between gap-4 py-2"
            >
              <input
                type="text"
                defaultValue={task.content}
                onChange={(e) =>
                  handleUpdateContent(task.rowId!, e.target.value)
                }
                className="flex-1 rounded border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Trash2Icon
                className="text-red-500"
                onClick={() => handleDeleteTask(task.rowId!)}
              />
            </div>
          ))}

          <form onSubmit={handleAddTask} className="mt-6 w-full">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskContent}
                onChange={(e) => setNewTaskContent(e.target.value)}
                placeholder="Enter new task content..."
                className="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={!newTaskContent.trim()}
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export const Route = createFileRoute("/testing")({
  component: RouteComponent,
});
