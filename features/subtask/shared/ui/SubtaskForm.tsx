"use client"

import type React from 'react'
import { Task } from '@/features/task/shared/types/task.types'
import { useSubtaskForm } from '@/features/subtask/shared/hooks/useSubtaskForm'
import { SubtaskFormView } from '@/features/subtask/shared/ui/SubtaskFormView'

export function SubtaskForm({ taskId, subtask, onSuccess }: { taskId: string; subtask: Task | null; onSuccess: () => void }) {
  const { formData, handleChange, handleSubmit, isLoading, error } = useSubtaskForm({ taskId, subtask, onSuccess })

  return (
    <SubtaskFormView
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
    />
  )
}
