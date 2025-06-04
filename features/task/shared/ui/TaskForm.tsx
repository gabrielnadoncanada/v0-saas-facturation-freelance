'use client';

import type React from 'react';

import { Task } from '@/features/task/shared/types/task.types';
import { useTaskForm } from '@/features/task/shared/hooks/useTaskForm';
import { TaskFormView } from '@/features/task/shared/ui/TaskFormView';

export function TaskForm({
  projectId,
  task,
  onSuccess,
  defaultStatus,
}: {
  projectId: string;
  task: Task | null;
  onSuccess: () => void;
  defaultStatus?: string;
}) {
  const { formData, handleChange, handleSubmit, isLoading, error } = useTaskForm({
    projectId,
    task,
    onSuccess,
    defaultStatus,
  });

  return (
    <TaskFormView
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      isEdit={!!task}
    />
  );
}
