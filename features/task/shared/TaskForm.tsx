"use client"

import type React from "react"

import { Task } from "@/shared/types/tasks/task"
import { useTaskForm } from "./hooks/useTaskForm"
import { TaskFormView } from "./ui/TaskFormView"


export function TaskForm({ projectId, task, onSuccess }: { projectId: string, task: Task, onSuccess: () => void }) {
  const {
    formData,
    handleChange,
    handleSubmit,
    isLoading,
    error,
  } = useTaskForm({ projectId, task, onSuccess })

  return (
    <TaskFormView
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      isEdit={!!task}
    />
  )
}
