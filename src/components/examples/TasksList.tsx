import { useState } from "react";

import { useGetTasksQuery } from "@/generated/graphql";
import { createGraphQLClient } from "@/utils/createGraphQLClient";

const TasksList = () => {
  const [isRefetching, setIsRefetching] = useState(false);

  // Create a GraphQL client
  const graphQLClient = createGraphQLClient();

  const { data, isLoading, isError, error, refetch } =
    useGetTasksQuery(graphQLClient);

  const handleRefetch = async () => {
    setIsRefetching(true);
    try {
      await refetch();
    } finally {
      setIsRefetching(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-primary-500 border-t-2 border-b-2" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800">
        <h3 className="font-medium text-lg">Error loading tasks</h3>
        <p className="mt-2 text-sm">
          {error?.message || "An unknown error occurred"}
        </p>
        <button
          type="button"
          onClick={handleRefetch}
          className="mt-4 rounded-md bg-red-100 px-4 py-2 font-medium text-red-800 text-sm hover:bg-red-200"
        >
          Try again
        </button>
      </div>
    );
  }

  const tasks = data?.tasks || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xl">Tasks</h2>
        <button
          type="button"
          onClick={handleRefetch}
          disabled={isRefetching}
          className="rounded-md bg-primary-50 px-3 py-1.5 font-medium text-primary-700 text-sm hover:bg-primary-100 disabled:opacity-50"
        >
          {isRefetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="py-4 text-center text-gray-500">No tasks found</p>
      ) : (
        <ul className="divide-y divide-gray-200 rounded-lg border">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-3 px-4 py-3">
              <span
                className={`h-2.5 w-2.5 rounded-full ${task.completed ? "bg-green-500" : "bg-amber-500"}`}
              />
              <div className="flex-1">
                <h3 className="font-medium">{task.title}</h3>
                {task.description && (
                  <p className="text-gray-600 text-sm">{task.description}</p>
                )}
                {task.dueDate && (
                  <p className="mt-1 text-gray-500 text-xs">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              {task.assignee && (
                <div className="text-right text-sm">
                  <p className="font-medium">{task.assignee.name}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TasksList;
