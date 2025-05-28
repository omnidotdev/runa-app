'use client';

import { useCreateTaskMutation, useGetTasksQuery } from '@/graphql/generated/graphql';
import { createGraphQLClient } from '@/utils/createGraphQLClient';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface FormData {
  title: string;
  description: string;
  dueDate: string;
}

export function CreateTaskForm() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    dueDate: '',
  });
  
  const queryClient = useQueryClient();
  const graphQLClient = createGraphQLClient();
  
  const { mutate, isPending, isError, error } = useCreateTaskMutation(graphQLClient, {
    onSuccess: () => {
      // Reset form
      setFormData({
        title: '',
        description: '',
        dueDate: '',
      });
      
      // Invalidate tasks queries to trigger a refetch
      queryClient.invalidateQueries({
        queryKey: [useGetTasksQuery.getKey()]
      });
      
      // Show success message
      alert('Task created successfully!');
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      alert('Title is required');
      return;
    }
    
    mutate({
      input: {
        title: formData.title,
        description: formData.description || undefined,
        dueDate: formData.dueDate || undefined,
      }
    });
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-xl font-semibold">Create New Task</h2>
      
      {isError && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-red-800">
          <p className="text-sm">{error?.message || 'An error occurred while creating the task'}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label htmlFor="dueDate" className="mb-1 block text-sm font-medium">
            Due Date
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isPending ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}