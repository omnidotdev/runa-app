"use client";

import { Suspense } from "react";

import CreateTaskForm from "@/components/examples/CreateTaskForm";
import TasksList from "@/components/examples/TasksList";

const ExamplesPage = () => {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="font-bold text-2xl">GraphQL and React Query Examples</h1>
        <p className="mt-2 text-gray-600">
          This page demonstrates how to use GraphQL and React Query in Runa App
        </p>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 font-semibold text-xl">Create a New Task</h2>
        <div className="rounded-lg bg-white p-1 shadow dark:bg-gray-800">
          <CreateTaskForm />
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-xl">Tasks List</h2>
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <Suspense fallback={<div>Loading...</div>}>
            <TasksList />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ExamplesPage;
