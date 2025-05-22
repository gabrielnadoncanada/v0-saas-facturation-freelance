"use client"

import type React from "react"

import { Task } from "@/features/task/shared/types/task.types"
import { useTaskForm } from "@/features/task/shared/hooks/useTaskForm"
import { TaskFormView } from "@/features/task/shared/ui/TaskFormView"
import { TeamMember } from "@/features/team/shared/types/team.types"


export function TaskForm({ projectId, task, teamMembers, onSuccess }: { projectId: string; task: Task; teamMembers: TeamMember[]; onSuccess: () => void }) {
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
      teamMembers={teamMembers}
      isEdit={!!task}
    />
  )
}
